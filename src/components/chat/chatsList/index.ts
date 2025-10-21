import Block from '@/modules/block';
import { template } from './template';
import { chatsList } from '@/services/chats/decorator';
import { ChatPreview } from './chatPreview';
import { UIText } from '@/ui';
import type { IChat } from '@/api/chatsApi/types';

@chatsList
export class ChatsList extends Block {
  constructor() {
    super({ wrapperProps: { classes: ['chats-list__list'] } });
  }

  public render(): DocumentFragment {
    const { chats } = this.props;

    let content: Block | Block[] = new UIText({
      tagName: 'div',
      value: 'Пока чатов нет...',
      wrapperProps: { classes: ['chats-list__empty-message'] }
    });

    if (chats && Array.isArray(chats) && chats.length) {
      content = chats.map((chat: IChat) => new ChatPreview(chat));
    }

    return this.compile(template, { ...this.props, content });
  }
}
