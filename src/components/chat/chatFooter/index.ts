import { BaseInput } from '@/ui/input/baseInput';
import { template } from './template';
import { Button, Form } from '@/ui';
import { emptyValidator } from '@/utils/validators';
import { DropwdownMenuActivator } from '@/services/dropwdownMenu';
import { FileUploadModal } from '@/services/fileUpload';
import modalService from '@/services/modal';
import chatsService from '@/services/chats';

export class ChatFooter extends Form {
  constructor() {
    const input = new BaseInput({
      type: 'text',
      name: 'message',
      placeholder: 'Сообщение',
      validators: [emptyValidator],
      wrapperProps: { classes: ['chat-footer__message-input'] }
    });

    const attachDropdown = new DropwdownMenuActivator([
      {
        icon: 'image-outline',
        title: 'Фото или Видео',
        callback: () => {
          const fileUpload = new FileUploadModal(async (data) => {
            console.log('fileUpload', data);
          }, 'image');

          modalService.open({
            isCloseOnOutsideClick: true,
            isShaded: true,
            content: fileUpload.card
          });
        }
      }
    ]);

    const attachBtn = new Button({
      color: 'secondary',
      variant: 'text',
      iconName: 'paperclip',
      iconSize: 32,
      wrapperProps: { classes: ['rotate-45'] }
    });
    attachBtn.click = (event) => {
      attachDropdown.activate(event);
    };

    const submitBtn = new Button({
      color: 'primary',
      variant: 'filled',
      type: 'submit',
      iconName: 'arrow-right',
      iconSize: 16,
      wrapperProps: {
        styles: ['height:28px']
      }
    });
    submitBtn.click = () => {
      chatsService.sendMessage(input.value);
      input.clear();
    };
    super({ attachBtn, submitBtn, input, wrapperProps: { classes: ['chat-footer'] } });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
