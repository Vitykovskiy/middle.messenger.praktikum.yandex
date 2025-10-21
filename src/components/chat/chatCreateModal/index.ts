import chatService from '@/services/chats';
import modal from '@/services/modal';
import { Button, Card, Form, Input } from '@/ui';
import { UIText } from '@/ui';
import { emptyValidator } from '@/utils/validators';

export class ChatCreateModal extends Form {
  constructor() {
    const header = new UIText({
      value: 'Создание чата'
    });

    const nameInput = new Input({
      name: 'chat-name',
      label: 'Наименование',
      type: 'text',
      validators: [emptyValidator]
    });

    const confirmBtn = new Button({
      label: 'Добавить',
      type: 'submit',
      wrapperProps: { styles: ['width: 100%'] }
    });

    const content = new Card({
      header,
      content: nameInput,
      actions: confirmBtn,
      wrapperProps: { styles: ['width: 320px'] }
    });

    super({ content });
  }

  public async onSubmit(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const title = formData.get('chat-name') as string | null;
    modal.close();

    if (title) {
      await chatService.createChat(title);
    }
  }
}
