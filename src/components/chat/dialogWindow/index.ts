import Block from '@/modules/block';
import { template } from './template';
import type { IMessage } from '@/services/dialog/types';
import { DialogMessage } from '../dialogMessage';

export class DialogWindow extends Block {
  constructor(messages: IMessage[]) {
    const msgBlock = messages.map((message) => new DialogMessage({ ...message }));
    super('main', { messages: msgBlock }, { classes: ['chat-conversation'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
