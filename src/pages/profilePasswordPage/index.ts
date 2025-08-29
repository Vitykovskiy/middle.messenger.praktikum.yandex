import { Button, Card, Form, Input } from '@/ui';
import { Avatar } from '@/components/avatar';
import { emptyValidator, passwordValidator } from '@/utils/validators';
import { ElementsNames, PASSWORD_MISMATCH_ERROR } from './constants';
import { isEqual } from '@/utils/helpers';
import userService from '@/services/user';
import { createConnectBlock } from '@/modules/connect';
import { isUser } from '@/api/authApi/types';

export class ProfilePasswordPage extends Form {
  constructor() {
    const avatar = createConnectBlock(Avatar, { size: 130 }, ({ user }) => ({
      src: isUser(user) ? user.avatar : null
    }));

    const confirmBtn = new Button({
      variant: 'filled',
      label: 'Сохранить',
      type: 'submit',
      wrapperProps: { styles: ['width: 100%'] }
    });

    const card = new Card({
      tagName: 'main',
      header: avatar,
      content: [
        new Input({
          label: 'Старый пароль',
          name: ElementsNames.OldPassword,
          key: 'oldPassword',
          value: '',
          type: 'password',
          validators: [emptyValidator]
        }),
        new Input({
          label: 'Новый пароль',
          name: ElementsNames.Password,
          key: 'newPassword',
          value: '',
          type: 'password',
          validators: [emptyValidator, passwordValidator]
        }),
        new Input({
          label: 'Повторите новый пароль',
          name: ElementsNames.PasswordCheck,
          key: 'passwordCheck',
          value: '',
          type: 'password',
          validators: [emptyValidator, passwordValidator]
        })
      ],
      actions: [confirmBtn],
      wrapperProps: { classes: ['profile'] }
    });

    super({ content: card });
  }

  onSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const oldPassword = formData.get(ElementsNames.OldPassword) as string;
    const newPassword = formData.get(ElementsNames.Password) as string;
    const passwordCheck = formData.get(ElementsNames.PasswordCheck) as string;

    if (!oldPassword || !newPassword || !passwordCheck) {
      throw new Error('All form values should be filled');
    }

    if (isEqual(newPassword, passwordCheck)) {
      userService.editPassword({ oldPassword, newPassword });
    } else {
      const card = this.children.content as Card;
      const [_, passwordInput, newPasswordInput] = card.children.content as Input[];
      passwordInput.setProps({ error: PASSWORD_MISMATCH_ERROR });
      newPasswordInput.setProps({ error: PASSWORD_MISMATCH_ERROR });
    }
  }
}
