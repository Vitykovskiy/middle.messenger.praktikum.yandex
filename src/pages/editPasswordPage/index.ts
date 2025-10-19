import { Button, Card, Form, Input } from '@/ui';
import { Avatar } from '@/components/avatar';
import { passwordValidator } from '@/utils/validators';

export class EditPasswordFormPage extends Form {
  constructor() {
    const avatar = new Avatar({ size: 130 });

    const confirmBtn = new Button(
      { variant: 'filled', label: 'Сохранить', type: 'submit' },
      { styles: ['margin-top: 60px'] }
    );

    const card = new Card(
      {
        titleSlot: avatar,
        contentSlot: [
          new Input({
            label: 'Старый пароль',
            name: 'old-password',
            key: 'oldPassword',
            value: '',
            type: 'password'
          }),
          new Input({
            label: 'Новый пароль',
            name: 'new-password',
            key: 'newPassword',
            value: '',
            type: 'password',
            validator: passwordValidator
          }),
          new Input({
            label: 'Повторите новый пароль',
            name: 'password-check',
            key: 'passwordCheck',
            value: '',
            type: 'password',
            validator: passwordValidator
          })
        ],
        actions: [confirmBtn]
      },
      { classes: ['profile'] }
    );

    super({ content: card });
  }
}
