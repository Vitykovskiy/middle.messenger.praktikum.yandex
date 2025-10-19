import { Button, Card, Form, Input } from '@/ui';
import { Avatar } from '@/components/avatar';
import type { TEditProfilePageProps } from './types';
import {
  emailValidator,
  firstNameValidator,
  phoneValidator,
  secondNameValidator
} from '@/utils/validators';

export class EditProfileFormPage extends Form {
  constructor(props: TEditProfilePageProps) {
    const avatar = new Avatar({ size: 130 });

    const confirmBtn = new Button(
      { variant: 'filled', label: 'Подтвердить', type: 'submit' },
      { styles: ['margin-top: 60px'] }
    );

    const card = new Card(
      {
        titleSlot: avatar,
        contentSlot: [
          new Input({
            label: 'Почта',
            name: 'email',
            key: 'email',
            value: props.email,
            validator: emailValidator
          }),
          new Input({ label: 'Логин', name: 'login', key: 'login', value: props.login }),
          new Input({
            label: 'Имя',
            name: 'first_name',
            key: 'firstName',
            value: props.firstName,
            validator: firstNameValidator
          }),
          new Input({
            label: 'Фамилия',
            name: 'second_name',
            key: 'secondName',
            value: props.secondName,
            validator: secondNameValidator
          }),
          new Input({
            label: 'Имя в чате',
            name: 'display_name',
            key: 'displayName',
            value: props.displayName
          }),
          new Input({
            label: 'Телефон',
            name: 'phone',
            key: 'phone',
            value: props.phone,
            validator: phoneValidator
          })
        ],
        actions: [confirmBtn]
      },
      { classes: ['profile'] }
    );

    super({ content: card, ...props });
  }
}
