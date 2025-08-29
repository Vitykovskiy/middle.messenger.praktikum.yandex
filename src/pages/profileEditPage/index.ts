import { Button, Card, Form, Input } from '@/ui';
import { Avatar } from '@/components/avatar';
import {
  emailValidator,
  emptyValidator,
  firstNameValidator,
  loginValidator,
  phoneValidator,
  secondNameValidator
} from '@/utils/validators';
import { ElementsNames } from './constants';
import { template } from '@/ui/form/template';
import userService from '@/services/user';
import { createConnectBlock } from '@/modules/connect';
import { isUser } from '@/api/authApi/types';
import modalService from '@/services/modal';
import { FileUploadModal } from '@/services/fileUpload';

export class ProfileEditPage extends Form {
  constructor() {
    const confirmBtn = new Button({
      variant: 'filled',
      label: 'Подтвердить',
      type: 'submit',
      wrapperProps: { styles: ['width: 100%'] }
    });

    const userAvatar = createConnectBlock(Avatar, { size: 130 }, ({ user }) => ({
      src: isUser(user) ? user.avatar : null
    }));

    const changeAvatarBtn = new Button({ iconSlot: userAvatar, name: 'avatarBtn' });
    changeAvatarBtn.click = () => {
      const fileUpload = new FileUploadModal(async (data) => {
        await userService.editAvatar(data);
      }, 'avatar');

      modalService.open({
        isCloseOnOutsideClick: true,
        isShaded: true,
        content: fileUpload.card
      });
    };

    const email = createConnectBlock(
      Input,
      {
        label: 'Почта',
        name: ElementsNames.Email,
        key: 'email',
        validators: [emailValidator, emptyValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.email : null })
    );
    const login = createConnectBlock(
      Input,
      {
        label: 'Логин',
        name: ElementsNames.Login,
        key: 'login',
        validators: [emptyValidator, loginValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.login : null })
    );
    const firstName = createConnectBlock(
      Input,
      {
        label: 'Имя',
        name: ElementsNames.FirstName,
        key: 'firstName',
        validators: [firstNameValidator, emptyValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.first_name : null })
    );
    const secondName = createConnectBlock(
      Input,
      {
        label: 'Фамилия',
        name: ElementsNames.SecondName,
        key: 'secondName',
        validators: [secondNameValidator, emptyValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.second_name : null })
    );
    const displayName = createConnectBlock(
      Input,
      {
        label: 'Имя в чате',
        name: ElementsNames.DisplayName,
        key: 'displayName',
        validators: [emptyValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.display_name : null })
    );
    const phone = createConnectBlock(
      Input,
      {
        label: 'Телефон',
        name: ElementsNames.Phone,
        key: 'phone',
        validators: [phoneValidator, emptyValidator]
      },
      ({ user }) => ({ value: isUser(user) ? user.phone : null })
    );
    const content = new Card({
      tagName: 'main',
      header: changeAvatarBtn,
      content: [email, login, firstName, secondName, displayName, phone],
      actions: [confirmBtn],
      wrapperProps: { classes: ['profile'] }
    });

    super({ content });
  }

  public onSubmit(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const email = formData.get(ElementsNames.Email) as string;
    const login = formData.get(ElementsNames.Login) as string;
    const first_name = formData.get(ElementsNames.FirstName) as string;
    const second_name = formData.get(ElementsNames.SecondName) as string;
    const display_name = formData.get(ElementsNames.DisplayName) as string;
    const phone = formData.get(ElementsNames.Phone) as string;

    if (!email || !login || !first_name || !second_name || !display_name || !phone) {
      throw new Error('All form values should be filled');
    }

    userService.editProfile({ email, login, first_name, second_name, display_name, phone });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
