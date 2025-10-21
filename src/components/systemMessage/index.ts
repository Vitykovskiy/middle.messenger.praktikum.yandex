import { Card, Button } from '@/ui';
import type { ISystemMessageProps } from './types';
import { merge } from '@/utils/helpers';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';

export class SystemMessage extends Card {
  constructor(props: ISystemMessageProps) {
    const { message, title, ...rest } = props;
    const returnBtn = new Button({
      label: 'Назад к чатам',
      variant: 'text'
    });

    returnBtn.click = () => {
      router.go({ name: RoutesNames.MessengerPage });
    };

    super(
      merge(
        {
          header: title,
          content: message,
          actions: returnBtn,
          wrapperProps: { classes: ['system-message'] }
        },
        rest
      )
    );
  }
}
