import { Button, Input, Card, Form } from '@/ui';
import { loginValidator, passwordValidator } from '@/utils/validators';

export class LoginPage extends Form {
  constructor() {
    const enterBtn = new Button({ label: 'Войти', type: 'submit' });
    const signInBtn = new Button({ label: 'Нет аккаунта?', variant: 'text' });

    const loginInput = new Input({ name: 'login', label: 'Логин', validator: loginValidator });
    const passwordInput = new Input({
      name: 'password',
      type: 'password',
      label: 'Пароль',
      validator: passwordValidator
    });

    const card = new Card({
      title: 'Вход',
      contentSlot: [loginInput, passwordInput],
      actions: [enterBtn, signInBtn]
    });

    super({ content: card }, { classes: ['login__card'] });
  }
}
