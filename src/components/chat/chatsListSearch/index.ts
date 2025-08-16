import Block from '@/modules/block';
import { template } from './template';

export class ChatsListSearch extends Block {
  constructor() {
    super('div', {}, { classes: ['chats-search'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
