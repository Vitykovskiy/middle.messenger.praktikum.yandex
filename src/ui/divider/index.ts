import Block from '@/modules/block';
import { template } from './template';
import type { IDividerProps } from './types';
import { resolveConditionalProps } from '@/modules/block/helpers';
import { merge } from '@/utils/helpers';

export default class Divider extends Block {
  constructor(props: IDividerProps = {}) {
    super(
      merge(
        {
          wrapperProps: {
            classes: resolveConditionalProps([
              ['ui-divider'],
              [`ui-divider_${props.color}`, !!props.color]
            ]),
            styles: resolveConditionalProps([[`border-width:${props.size}px`, !!props.size]])
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
