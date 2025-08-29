import Block from '@/modules/block';
import { ChatsList } from '../chatsList';
import { ChatsListSearch } from '../chatsListSearch';
import { template } from './template';

export class ChatSidebar extends Block {
  constructor() {
    const search = new ChatsListSearch();
    const chatsList = new ChatsList();
    super({ search, chatsList });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
