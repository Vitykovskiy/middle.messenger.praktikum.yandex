import Block from '@/modules/block';
import { template } from './template';
import { ChatHeader } from '../chatHeader';
import { ChatFooter } from '../chatFooter';
import { DialogWindow } from '../dialogWindow';
import { activeChatId } from '@/services/chats/decorator';
import { Router, router } from '@/modules/router';
import { isNumber } from '@/utils/helpers';
import chats from '@/services/chats';
import { UIElement } from '@/ui/element';

@activeChatId
export class ChatWindow extends Block {
  private _header = new ChatHeader();
  private _dialog = new DialogWindow();
  private _footer = new ChatFooter();
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
