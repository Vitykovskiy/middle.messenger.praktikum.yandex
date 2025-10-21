import { Button, Card, Divider, Form } from '@/ui';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';
import { ViewFormItem } from '@/components/viewFormItem';
import { Avatar } from '@/components/avatar';
import userService from '@/services/user';
import { isUser } from '@/api/authApi/types';
import { createConnectBlock } from '@/modules/connect';

export class ProfilePage extends Form {
  constructor() {
    const avatar = createConnectBlock(Avatar, { size: 130 }, ({ user }) => ({
      src: isUser(user) ? user.avatar : null
    }));

    const changeProfileBtn = new Button({
      variant: 'text',
      label: 'Изменить данные'
    });
    changeProfileBtn.click = () => {
      router.go({ name: RoutesNames.ProfileEdit });
    };

    const changePasswordBtn = new Button({
      variant: 'text',
      label: 'Изменить пароль'
    });
    changePasswordBtn.click = () => {
      router.go({ name: RoutesNames.ProfilePassword });
    };

    const logoutBtn = new Button({
      variant: 'text',
      color: 'accent',
      label: 'Выйти'
    });
    logoutBtn.click = userService.logout;

    const emailInput = createConnectBlock(
      ViewFormItem,
      { label: 'Почта', key: 'email' },
      ({ user }) => ({ value: isUser(user) ? user.email : null })
    );
    const loginInput = createConnectBlock(
      ViewFormItem,
      { label: 'Логин', key: 'login' },
      ({ user }) => ({ value: isUser(user) ? user.login : null })
    );
    const firstNameInput = createConnectBlock(
      ViewFormItem,
      { label: 'Имя', key: 'firstName' },
      ({ user }) => ({ value: isUser(user) ? user.first_name : null })
    );
    const secondNameInput = createConnectBlock(
      ViewFormItem,
      { label: 'Фамилия', key: 'secondName' },
      ({ user }) => ({ value: isUser(user) ? user.second_name : null })
    );
    const displayNameInput = createConnectBlock(
      ViewFormItem,
      { label: 'Имя в чате', key: 'displayName' },
      ({ user }) => ({ value: isUser(user) ? user.display_name : null })
    );
    const phoneInput = createConnectBlock(
      ViewFormItem,
      { label: 'Телефон', key: 'phone' },
      ({ user }) => ({ value: isUser(user) ? user.phone : null })
    );

    const content = createConnectBlock(
      Card,
      {
        header: avatar,
        title: '',
        content: [
          emailInput,
          new Divider({ color: 'secondary' }),
          loginInput,
          new Divider({ color: 'secondary' }),
          firstNameInput,
          new Divider({ color: 'secondary' }),
          secondNameInput,
          new Divider({ color: 'secondary' }),
          displayNameInput,
          new Divider({ color: 'secondary' }),
          phoneInput
        ],
        actions: [
          changeProfileBtn,
          new Divider({ color: 'secondary' }),
          changePasswordBtn,
          new Divider({ color: 'secondary' }),
          logoutBtn
        ],
        wrapperProps: { classes: ['profile'] }
      },
      ({ user }) => ({ title: isUser(user) ? user.display_name : null })
    );

    super({ content });
  }
}
