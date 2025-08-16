import Block from '@/modules/block';
import { template } from './template';
import { ChatHeader } from '../chatHeader';
import { ChatFooter } from '../chatFooter';
import { DialogWindow } from '../dialogWindow';
import { getDialog } from '@/services/dialog';
import { Avatar } from '@/components/avatar';

export class Chat extends Block {
  constructor() {
    const { interlocutor, messages } = getDialog();
    const header = new ChatHeader({
      avatar: new Avatar({ size: 34 }),
      name: interlocutor.name
    });
    const dialog = new DialogWindow(messages);
    const footer = new ChatFooter();

    super('div', { header, dialog, footer }, { classes: [dialog ? 'chat' : 'empty-message'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
