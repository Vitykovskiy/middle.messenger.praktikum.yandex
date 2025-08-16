import { Button, Divider, Form } from '@/ui';
import { ViewFormItem } from '@/components/viewFormItem';
import { Avatar } from '@/components/avatar';
import type { IUserData } from './types';
import { ProfileCard } from './profileCard';

export class ProfileFormPage extends Form {
  constructor(userData: IUserData) {
    const avatar = new Avatar({ size: 130 });

    const changeProfileBtn = new Button({ variant: 'text', label: 'Изменить данные' });
    const changePasswordBtn = new Button({ variant: 'text', label: 'Изменить пароль' });
    const exitBtn = new Button({
      variant: 'text',
      color: 'accent',
      label: 'Выйти'
    });

    const card = new ProfileCard(
      {
        userData,
        titleSlot: avatar,
        title: userData.displayName,
        contentSlot: [
          new ViewFormItem({ label: 'Почта', key: 'email', value: userData.email }),
          new Divider({ color: 'secondary' }),
          new ViewFormItem({ label: 'Логин', key: 'login', value: userData.login }),
          new Divider({ color: 'secondary' }),
          new ViewFormItem({ label: 'Имя', key: 'firstName', value: userData.firstName }),
          new Divider({ color: 'secondary' }),
          new ViewFormItem({ label: 'Фамилия', key: 'secondName', value: userData.secondName }),
          new Divider({ color: 'secondary' }),
          new ViewFormItem({
            label: 'Имя в чате',
            key: 'displayName',
            value: userData.displayName
          }),
          new Divider({ color: 'secondary' }),
          new ViewFormItem({ label: 'Телефон', key: 'phone', value: userData.phone })
        ],
        actions: [
          changeProfileBtn,
          new Divider({ color: 'secondary' }),
          changePasswordBtn,
          new Divider({ color: 'secondary' }),
          exitBtn
        ]
      },
      { classes: ['profile'] }
    );

    super({ content: card, ...userData });
  }

  public componentDidUpdate(_oldUserData: IUserData, newUserData: IUserData): boolean {
    const formCard = this.children.content;
    if (!formCard || !(formCard instanceof ProfileCard)) {
      throw new Error('ProfileCard not found');
    }

    formCard.setProps({
      title: newUserData.displayName,
      userData: newUserData
    });

    return true;
  }
}
