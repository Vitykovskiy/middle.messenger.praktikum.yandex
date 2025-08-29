import Block from '@/modules/block';
import { template } from './template';
import { UIElement } from '@/ui/element';
import { chatMessages } from '@/services/chats/decorator';
import type { TextMessageRes } from '@/api/chatsApi/types';
import { DialogMessage } from '../dialogMessage';
import user from '@/services/user';
import { formatMessageTime } from '@/utils/dateTime';
import type { IBlockProps } from '@/modules/block/types';

@chatMessages
export class DialogWindow extends Block {
  private _emptyMessagesBlock = new UIElement({
    content: 'Пока нет сообщений',
    wrapperProps: { classes: ['empty-message'] }
  });

  constructor() {
    super({
      tagName: 'main',
      wrapperProps: { classes: ['chat-conversation'] }
    });
  }

  public render(): DocumentFragment {
    const messagesList = this.props.messages;

    const messages =
      Array.isArray(messagesList) && messagesList.length
        ? messagesList
            .map((message: TextMessageRes) => new DialogMessage(this._resolveMessageProps(message)))
            .reverse()
        : this._emptyMessagesBlock;

    return this.compile(template, { messages });
  }

  private _resolveMessageProps(msg: TextMessageRes): IBlockProps {
    const { user_id, is_read, time, content } = msg;

    return {
      isOutgoing: user.isCurrentUserById(user_id),
      isReaded: is_read,
      time: formatMessageTime(time),
      text: content
    };
  }
}
