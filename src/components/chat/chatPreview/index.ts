import Block from '@/modules/block';
import { template } from './template';
import type { IBlockWrapperProps } from '@/modules/block/types';
import type { TChatPreviewBlockProps } from './types';

export class ChatPreview extends Block {
  constructor(props: TChatPreviewBlockProps, options: IBlockWrapperProps = {}) {
    const classes = ['chat-preview'];

    if (props.active) {
      classes.push('chat-preview_active');
    }

    super('div', props, { classes: ['chat-preview', ...(options.classes ?? [])] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
