import Block from '@/modules/block';
import type { IChatLayoutProps } from './types';
import { template } from './template';

export default class ChatLayout extends Block {
  constructor(props: IChatLayoutProps) {
    super('div', props, { classes: ['chat-layout'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
