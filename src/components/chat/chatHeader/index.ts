import Block from '@/modules/block';
import { template } from './template';
import type { IChatHeaderProps } from './types';
import { Button } from '@/ui';

export class ChatHeader extends Block {
  constructor(props: IChatHeaderProps) {
    const profileBtn = new Button({ color: 'primary', variant: 'text', label: 'options' });
    super('header', { ...props, profileBtn }, { classes: ['chat-header'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
