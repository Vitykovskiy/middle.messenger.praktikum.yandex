import Block from '@/modules/block';
import { template } from './template';
import type { IIconProps } from './types';
import { merge } from '@/utils/helpers';
import { resolveConditionalProps } from '@/modules/block/helpers';

export default class Icon extends Block {
  constructor(props: IIconProps) {
    super(
      merge(
        {
          tagName: 'i',
          wrapperProps: {
            styles: resolveConditionalProps([[`font-size:${props.size}px`, !!props.size]])
          }
        },
        props
      )
    );
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
