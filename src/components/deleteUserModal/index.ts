import { Avatar } from '@/components/avatar';
import { ViewFormItem } from '@/components/viewFormItem';
import Block from '@/modules/block';
import { Button, Icon } from '@/ui';
import { UIText } from '@/ui';
import { UIElement } from '@/ui/element';
import { template } from './template';
import { activeChatUsers } from '@/services/user/decorators';
import { isNumber } from '@/utils/helpers';
import { type IUser } from '@/api/authApi/types';
import modal from '@/services/modal';
import chats from '@/services/chats';

@activeChatUsers
export class DeleteUserModal extends Block {
  private _usersToDelete: number[] = [];
  constructor() {
    const header = new UIText({
      value: 'Удалить пользователей',
      wrapperProps: { class: ['ui-card__header'] }
    });

    const confirmBtn = new Button({ label: 'Удалить' });
    confirmBtn.click = () => {
      if (this._usersToDelete.length) {
        chats.deleteUsersFromChat(this._usersToDelete);
      }
      modal.close();
    };

    super({
      header,
      confirmBtn,
      wrapperProps: { classes: ['ui-card', 'user-search-modal'] }
    });
  }

  public render(): DocumentFragment {
    const { users } = this.props;

    let searchResult: Block[] = [];

    if (users && Array.isArray(users)) {
      searchResult = this._resolveSearchResult(users);
    }

    return this.compile(template, { ...this.props, searchResult });
  }

  private _resolveSearchResult(users: IUser[]): Block[] {
    return users
      .filter(({ id }) => id !== null)
      .map(({ id, login, avatar, display_name }) => {
        const avatarBlock = new Avatar({ size: 34, src: avatar });
        const deleteBtnIcon = new Icon({
          color: 'accent',
          size: 25,
          iconName: 'trash-can-outline',
          type: 'flat'
        });
        const deleteBtn = new Button({
          variant: 'text',
          iconSlot: deleteBtnIcon
        });
        deleteBtn.click = () => {
          const isUserAdded = this._usersToDelete.some(
            (value: number) => isNumber(id) && value === id
          );
          if (isUserAdded) {
            this._usersToDelete = this._usersToDelete.filter((value) => value !== id);
            deleteBtnIcon.setProps({ iconName: 'trash-can-outline', color: 'accent' });
          } else {
            this._usersToDelete.push(id!);
            deleteBtnIcon.setProps({ iconName: 'cancel', color: 'accent' });
          }
        };

        const displayNameBlock = display_name
          ? new UIElement({
              content: display_name,
              wrapperProps: { classes: ['user-search-result__display-name'] }
            })
          : null;
        const loginBlock = login
          ? new UIElement({
              content: login,
              wrapperProps: { classes: ['user-search-result__login'] }
            })
          : null;

        const userInfoBlock = new ViewFormItem({
          label: new UIElement({
            content: [displayNameBlock, loginBlock].filter(Boolean) as Block[],
            wrapperProps: { classes: ['user-search-result__info'] }
          }),
          value: deleteBtn
        });

        return new ViewFormItem({
          label: avatarBlock,
          value: userInfoBlock
        });
      });
  }
}
