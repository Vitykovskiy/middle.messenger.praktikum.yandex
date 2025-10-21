import Block from '@/modules/block';
import { template } from './template';
import { BaseInput } from '@/ui/input/baseInput';
import chatsService from '@/services/chats';
import { Button } from '@/ui';

export class ChatsListSearch extends Block {
  constructor() {
    const input = new BaseInput({
      type: 'text',
      name: 'chats-search',
      placeholder: 'Искать',
      wrapperProps: { classes: ['chats-search__input'] }
    });

    const createChatBtn = new Button({
      type: 'button',
      variant: 'text',
      color: 'primary',
      label: 'Добавить чат'
    });
    createChatBtn.click = chatsService.onCreateChat;

    input.onInput = (value) => {
      if (value) {
        chatsService.searchChats(value);
      } else {
        chatsService.onClearChatsSearch();
      }
    };

    super({ createChatBtn, input, wrapperProps: { classes: ['chats-search'] } });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
