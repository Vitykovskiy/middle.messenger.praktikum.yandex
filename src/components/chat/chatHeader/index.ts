import Block from '@/modules/block';
import { template } from './template';
import { Button } from '@/ui';
import { DropwdownMenuActivator } from '@/services/dropwdownMenu';
import { Avatar } from '@/components/avatar';
import { AddUserModal } from '@/components/addUserModal';
import modal from '@/services/modal';
import { DeleteUserModal } from '@/components/deleteUserModal';

export class ChatHeader extends Block {
  constructor() {
    const profileDropdown = new DropwdownMenuActivator([
      {
        icon: 'plus-circle-outline',
        title: 'Добавить пользователей',
        callback: () => {
          modal.open({
            content: new AddUserModal(),
            isCloseOnOutsideClick: true,
            isShaded: true
          });
        }
      },
      {
        icon: 'close-circle-outline',
        title: 'Удалить пользователей',
        color: 'accent',
        callback: () => {
          modal.open({
            content: new DeleteUserModal(),
            isCloseOnOutsideClick: true,
            isShaded: true
          });
        }
      }
    ]);

    const profileBtn = new Button({
      color: 'secondary',
      variant: 'text',
      iconName: 'dots-vertical',
      iconSize: 24
    });
    profileBtn.click = (event) => profileDropdown.activate(event);

    super({ tagName: 'header', profileBtn, wrapperProps: { classes: ['chat-header'] } });
  }

  public render(): DocumentFragment {
    const src = this.props.avatar as string;
    const avatar = new Avatar({ size: 34, src });
    return this.compile(template, { avatar, ...this.props });
  }
}
