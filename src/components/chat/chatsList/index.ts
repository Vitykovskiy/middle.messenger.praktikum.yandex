import Block from '@/modules/block';
import { ChatsListSearch } from '@/components/chat/chatsListSearch';
import { getChats } from '@/services/chats';
import { template } from './template';
import { ChatPreview } from '../chatPreview';
import { Avatar } from '@/components/avatar';

const PROFILE_PIC_SIZE = 46;

export class ChatsList extends Block {
  constructor() {
    const search = new ChatsListSearch();
    const chats = getChats().map(({ dateTime, lastMessage, username, unreadedMessagesCount }) => {
      const avatar = new Avatar({ size: PROFILE_PIC_SIZE });
      return new ChatPreview({
        avatar,
        dateTime,
        username,
        unreadedMessagesCount,
        lastMessage
      });
    });

    super('div', { search, chats });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
