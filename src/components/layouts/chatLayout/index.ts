import Block from '@/modules/block';
import type { IChatLayoutProps } from './types';
import { template } from './template';
import { merge } from '@/utils/helpers';

export default class ChatLayout extends Block {
  constructor(props: IChatLayoutProps) {
    super(merge({ wrapperProps: { classes: [['chat-layout']] } }, props));
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
