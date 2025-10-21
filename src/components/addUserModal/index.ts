import { Avatar } from '@/components/avatar';
import { ViewFormItem } from '@/components/viewFormItem';
import Block from '@/modules/block';
import { Button, Icon } from '@/ui';
import { UIText } from '@/ui';
import { UIElement } from '@/ui/element';
import { Input } from '@/ui';
import debounce from '@/utils/debounce';
import userService from '@/services/user';
import { template } from './template';
import { userSearch } from '@/services/user/decorators';
import { isNumber } from '@/utils/helpers';
import { type IUser } from '@/api/authApi/types';
import modal from '@/services/modal';
import chatsService from '@/services/chats';

@userSearch
export class AddUserModal extends Block {
  private _usersToAdd: number[] = [];
  constructor() {
    const header = new UIText({
      value: 'Добавить пользователей',
      wrapperProps: { class: ['ui-card__header'] }
    });
    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      type: 'text'
    });
    loginInput.onInput = debounce(async (value) => {
      if (value) {
        await userService.userSearch(value);
      } else {
        userService.clearUserSearch();
      }
    }, 300);

    const confirmBtn = new Button({ label: 'Добавить' });
    confirmBtn.click = () => {
      if (this._usersToAdd.length) {
        chatsService.addUsersToCurrentChat(this._usersToAdd);
      }
      modal.close();
    };

    super({
      header,
      loginInput,
      confirmBtn,
      wrapperProps: { classes: ['ui-card', 'user-search-modal'] }
    });
  }

  public render(): DocumentFragment {
    const { users } = this.props;

    const searchResultHeader = new UIText({
      value: 'Результат поиска',
      wrapperProps: { class: ['user-search-modal__search-result-header'] }
    });

    let searchResult: Block[] = [];

    if (users && Array.isArray(users)) {
      searchResult = this._resolveSearchResult(users);
    }

    return this.compile(template, { ...this.props, searchResultHeader, searchResult });
  }

  public onUnmount(): void {
    userService.clearUserSearch();
  }

  private _resolveSearchResult(users: IUser[]): Block[] {
    return users
      .filter(({ id }) => id !== null)
      .map(({ id, login, avatar, display_name }) => {
        const avatarBlock = new Avatar({ size: 34, src: avatar });
        const addBtnIcon = new Icon({
          color: 'primary',
          size: 25,
          iconName: 'plus-circle-outline',
          type: 'flat'
        });
        const addBtn = new Button({
          variant: 'text',
          iconSlot: addBtnIcon
        });
        addBtn.click = () => {
          const isUserAdded = this._usersToAdd.some(
            (value: number) => isNumber(id) && value === id
          );
          if (isUserAdded) {
            this._usersToAdd = this._usersToAdd.filter((value) => value !== id);
            addBtnIcon.setProps({ iconName: 'plus-circle-outline', color: 'primary' });
          } else {
            this._usersToAdd.push(id!);
            addBtnIcon.setProps({ iconName: 'minus-circle-outline', color: 'accent' });
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
          value: addBtn
        });

        return new ViewFormItem({
          label: avatarBlock,
          value: userInfoBlock
        });
      });
  }
}
