import Block from '@/modules/block';
import { template } from './template';
import { ChatHeader as MessengerHeader } from '../chatHeader';
import { ChatFooter as MessengerFooter } from '../chatFooter';
import { DialogWindow } from '../dialogWindow';
import { activeChatId } from '@/services/chats/decorator';
import { Router, router } from '@/modules/router';
import { isNumber } from '@/utils/helpers';
import chats from '@/services/chats';
import { UIElement } from '@/ui/element';
import { createConnectBlock } from '@/modules/connect';
import type { IChat } from '@/api/chatsApi/types';
import { CHATS_LIST_STORE_KEY, ACTIVE_CHAT_ID_STORE_KEY } from '@/services/chats/constants';

@activeChatId
export class MessengerWindow extends Block {
  private _header = createConnectBlock(MessengerHeader, {}, (state) => {
    const chats = state[CHATS_LIST_STORE_KEY];
    const activeChatId = state[ACTIVE_CHAT_ID_STORE_KEY];
    const activeChat = (chats as IChat[])?.find(({ id }) => activeChatId === id);
    return { avatarSrc: activeChat?.avatar, name: activeChat?.title };
  });
  private _dialog = new DialogWindow();
  private _footer = new MessengerFooter();
  private _emptyMessage = new UIElement({
    content: ' Выберите чат чтобы отправить сообщение',
    wrapperProps: { classes: ['empty-message'] }
  });

  constructor() {
    super({
      wrapperProps: { classes: ['chat'] }
    });
  }

  public render(): DocumentFragment {
    const { activeChat } = this.props;
    return this.compile(template, {
      dialog: this._dialog,
      header: this._header,
      footer: this._footer,
      emptyMessage: this._emptyMessage,
      showDialog: activeChat
    });
  }

  public onMount(): void {
    router.eventBus.on(Router.EVENTS.ROUTE_CHANGE, () => {
      this._activateDialog();
    });

    this._activateDialog();
  }

  private async _activateDialog(): Promise<void> {
    const id = Number(router.parameters?.id);

    if (!isNumber(id)) {
      return;
    }

    await chats.activateChat(id);
  }
}
