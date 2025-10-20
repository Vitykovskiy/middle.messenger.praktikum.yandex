import Block from '@/modules/block';
import { template } from './template';
import { Button } from '@/ui';
import { DropwdownMenuActivator } from '@/services/dropwdownMenu';
import { Avatar } from '@/components/avatar';
import { AddUserModal } from '@/components/addUserModal';
import modal from '@/services/modal';
import { DeleteUserModal } from '@/components/deleteUserModal';
import { ConfirmDialog } from '@/components/confirmDialog';
import chatsService from '@/services/chats';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';
import { FileUploadModal } from '@/services/fileUpload';
import { activeChat } from '@/services/chats/decorator';
import type { IChat } from '@/api/chatsApi/types';

@activeChat
export class ChatHeader extends Block {
  constructor() {
    const profileDropdown = new DropwdownMenuActivator([
      {
        icon: 'image-edit-outline',
        title: 'Изменить фото',
        callback: () => {
          const fileUpload = new FileUploadModal(async (data) => {
            await chatsService.editAvatar(data);
          }, 'avatar');

          modal.open({
            isCloseOnOutsideClick: true,
            isShaded: true,
            content: fileUpload.card
          });
        }
      },
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
      },
      {
        icon: 'trash-can-outline',
        title: 'Удалить чат',
        color: 'accent',
        callback: () => {
          modal.open({
            content: new ConfirmDialog({
              title: 'Вы действтельно готовы удалить чат?',
              confirmCallback: async () => {
                modal.close();
                await chatsService.onDeleteActiveChat();
                router.go({ name: RoutesNames.MessengerPage });
              },
              cancelCallback: () => modal.close()
            }),
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
    const activeChat = this.props.activeChat as IChat;
    const src = activeChat?.avatar;
    const name = activeChat?.title;

    const avatar = new Avatar({ size: 34, src });
    return this.compile(template, { avatar, name, ...this.props });
  }
}
