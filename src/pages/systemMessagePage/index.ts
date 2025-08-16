import { Card, Button } from '@/ui';
import type { ISystemMessageProps } from './types';

export class SystemMessage extends Card {
  constructor(props: ISystemMessageProps) {
    const returnBtn = new Button({ label: 'Назад к чатам', variant: 'text' });
    super(
      { title: props.title, content: props.message, actions: returnBtn },
      { classes: ['system-message'] }
    );
  }
}
