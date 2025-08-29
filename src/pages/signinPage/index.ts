import userService from '@/services/user';
import { Button, Input, Card, Form } from '@/ui';
import { emptyValidator } from '@/utils/validators';
import { ElementsNames } from './constants';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';

export class SigninPage extends Form {
  constructor() {
    const enterBtn = new Button({
      label: 'Войти',
      type: 'submit',
      wrapperProps: { styles: ['width: 100%'] }
    });
    const signInBtn = new Button({
      label: 'Нет аккаунта?',
      variant: 'text',
      wrapperProps: { styles: ['margin:4px auto 0'] }
    });
    signInBtn.click = () => {
      router.go({ name: RoutesNames.SignUpPage });
    };

    const loginInput = new Input({
      name: ElementsNames.Login,
      label: 'Логин',
      type: 'text',
      validators: [emptyValidator]
    });
    const passwordInput = new Input({
      name: ElementsNames.Password,
      type: 'password',
      label: 'Пароль',
      validators: [emptyValidator]
    });

    const card = new Card({
      tagName: 'main',
      header: 'Вход',
      content: [loginInput, passwordInput],
      actions: [enterBtn, signInBtn]
    });

    super({
      content: card,
      wrapperProps: { classes: ['signin__card'] }
    });
  }

  onSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const login = formData.get(ElementsNames.Login) as string;
    const password = formData.get(ElementsNames.Password) as string;

    if (!login || !password) {
      throw new Error('Both form values should be filled');
    }

    userService.signIn({ login, password });
  }
}
