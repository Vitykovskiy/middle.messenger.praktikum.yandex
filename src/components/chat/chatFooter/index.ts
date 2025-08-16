import { BaseInput } from '@/ui/input/baseInput';
import { template } from './template';
import { Button, Form } from '@/ui';

export class ChatFooter extends Form {
  constructor() {
    const input = new BaseInput(
      {
        type: 'text',
        name: 'message',
        placeholder: 'Сообщение',
        validator: (value: string) => (value ? null : 'Сообщение пусто')
      },
      { classes: ['chat-footer__message-input'] }
    );

    const attachBtn = new Button({ color: 'primary', variant: 'text', label: 'attach' });
    const submitBtn = new Button({
      color: 'primary',
      variant: 'text',
      label: 'submit',
      type: 'submit'
    });
    super({ attachBtn, submitBtn, input }, { classes: ['chat-footer'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
