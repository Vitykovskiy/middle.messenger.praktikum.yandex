import { Button, Input, Card, Form } from '@/ui';
import { template } from './template';
import {
  emailValidator,
  firstNameValidator,
  loginValidator,
  passwordValidator,
  phoneValidator,
  secondNameValidator
} from '@/utils/validators';

export class SignInPage extends Form {
  constructor() {
    const confirmBtn = new Button({ label: 'Зарегистрироваться', type: 'submit' });
    const loginBtn = new Button({ label: 'Войти', variant: 'text' });

    const emailInput = new Input({
      name: 'email',
      label: 'Почта',
      validator: emailValidator
    });
    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      validator: loginValidator
    });
    const firstNameInput = new Input({
      name: 'first_name',
      label: 'Имя',
      validator: firstNameValidator
    });
    const secondNameInput = new Input({
      name: 'secondName',
      label: 'Фамилия',
      validator: secondNameValidator
    });
    const phoneInput = new Input({
      name: 'phone',
      label: 'Телефон',
      validator: phoneValidator
    });
    const passwordInput = new Input({
      name: 'password',
      type: 'password',
      label: 'Пароль',
      validator: passwordValidator
    });
    const passwordCheckInput = new Input({
      name: 'password-check',
      type: 'password',
      label: 'Пароль (ещё раз)',
      validator: passwordValidator
    });

    const card = new Card({
      title: 'Регистрация',
      contentSlot: [
        emailInput,
        loginInput,
        firstNameInput,
        secondNameInput,
        phoneInput,
        passwordInput,
        passwordCheckInput
      ],
      actions: [confirmBtn, loginBtn]
    });

    super({ content: card }, { classes: ['signin__card'] });
  }

  render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
