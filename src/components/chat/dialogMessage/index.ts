import Block from '@/modules/block';
import { template } from './template';
import { merge } from '@/utils/helpers';
import { resolveConditionalProps } from '@/modules/block/helpers';
import type { IBlockProps } from '@/modules/block/types';

export class DialogMessage extends Block {
  constructor(props: IBlockProps) {
    const { isOutgoing, ...rest } = props;

    super(
      merge(
        {
          wrapperProps: {
            classes: resolveConditionalProps([['message'], ['message_outgoing', !!isOutgoing]])
          }
        },
        rest
      )
    );
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
