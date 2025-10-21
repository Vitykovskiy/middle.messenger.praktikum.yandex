import { Button, Input, Card, Form } from '@/ui';
import {
  emailValidator,
  emptyValidator,
  firstNameValidator,
  loginValidator,
  passwordValidator,
  phoneValidator,
  secondNameValidator
} from '@/utils/validators';
import { ElementsNames } from './constants';
import userService from '@/services/user';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';

export class SignupPage extends Form {
  constructor() {
    const confirmBtn = new Button({
      label: 'Зарегистрироваться',
      type: 'submit',
      wrapperProps: { styles: ['width: 100%'] }
    });
    const toSigninBtn = new Button({
      label: 'Войти',
      variant: 'text',
      wrapperProps: { styles: ['margin:4px auto 0'] }
    });
    toSigninBtn.click = () => {
      router.go({ name: RoutesNames.SigninPage });
    };

    const emailInput = new Input({
      name: ElementsNames.Email,
      label: 'Почта',
      validators: [emptyValidator, emailValidator]
    });
    const loginInput = new Input({
      name: ElementsNames.Login,
      label: 'Логин',
      validators: [emptyValidator, loginValidator]
    });
    const firstNameInput = new Input({
      name: ElementsNames.FirstName,
      label: 'Имя',
      validators: [emptyValidator, firstNameValidator]
    });
    const secondNameInput = new Input({
      name: ElementsNames.SecondName,
      label: 'Фамилия',
      validators: [emptyValidator, secondNameValidator]
    });
    const phoneInput = new Input({
      name: ElementsNames.Phone,
      label: 'Телефон',
      validators: [emptyValidator, phoneValidator]
    });
    const passwordInput = new Input({
      name: ElementsNames.Password,
      type: 'password',
      label: 'Пароль',
      validators: [emptyValidator, passwordValidator]
    });
    const passwordCheckInput = new Input({
      name: ElementsNames.PasswordCheck,
      type: 'password',
      label: 'Пароль (ещё раз)',
      validators: [emptyValidator, passwordValidator]
    });

    const card = new Card({
      tagName: 'main',
      header: 'Регистрация',
      content: [
        emailInput,
        loginInput,
        firstNameInput,
        secondNameInput,
        phoneInput,
        passwordInput,
        passwordCheckInput
      ],
      actions: [confirmBtn, toSigninBtn]
    });

    super({
      content: card,
      wrapperProps: { classes: ['signup__card'] }
    });
  }

  onSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const login = formData.get(ElementsNames.Login) as string;
    const email = formData.get(ElementsNames.Email) as string;
    const first_name = formData.get(ElementsNames.FirstName) as string;
    const second_name = formData.get(ElementsNames.SecondName) as string;
    const phone = formData.get(ElementsNames.Phone) as string;
    const password = formData.get(ElementsNames.Password) as string;

    if (!login || !email || !first_name || !second_name || !phone || !password) {
      throw new Error('All form values should be filled');
    }

    userService.signUp({ login, email, first_name, second_name, phone, password });
  }
}
