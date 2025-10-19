import Block from '@/modules/block';
import { template } from './template';
import type { TDialogMessageProps } from './types';

export class DialogMessage extends Block {
  constructor(props: TDialogMessageProps) {
    const classes = ['message'];

    if (props.isOutgoing) {
      classes.push('message_outgoing');
    }

    super('div', props, { classes });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
