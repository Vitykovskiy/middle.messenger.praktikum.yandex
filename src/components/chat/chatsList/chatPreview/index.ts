import Block from '@/modules/block';
import { template } from './template';
import { Avatar } from '@/components/avatar';
import type { IChat } from '@/api/chatsApi/types';
import type { IChatPreviewProps } from './types';
import { formatMessageTime } from '@/utils/dateTime';
import userService from '@/services/user';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';
import { resolveConditionalProps } from '@/modules/block/helpers';
import { activeChatId } from '@/services/chats/decorator';

@activeChatId
export class ChatPreview extends Block {
  private _id: number;

  constructor(options: IChat) {
    super({ options, wrapperProps: { classes: ['chat-preview'] } });

    this._id = options.id;

    this.setProps({ events: { click: this._click.bind(this) } });
  }

  public render(): DocumentFragment {
    const { options } = this.props as IChatPreviewProps;
    const wrapperProps = {
      classes: resolveConditionalProps([
        ['chat-preview'],
        ['chat-preview_active', this._id === this.props.activeChat]
      ])
    };

    this.props.wrapperProps = wrapperProps;

    const props = this._resoleveOptions(options);

    return this.compile(template, props);
  }

  private _click(): void {
    router.go({ name: RoutesNames.MessengerPage, params: { id: this._id } });
  }

  private _resoleveOptions(options: IChat): IChatPreviewProps {
    const { title, avatar: src, last_message: lastMessage, unread_count: unreadCount } = options;
    const { time, content, user } = lastMessage ?? {};

    const isOwnerLastMessage = user?.login ? userService.isCurrentUserByLogin(user.login) : false;
    const dateTime = time ? formatMessageTime(time) : '';
    const avatar = new Avatar({ size: 46, src });

    return {
      options,
      title,
      avatar,
      isOwnerLastMessage,
      unreadCount,
      dateTime,
      content
    };
  }
}
