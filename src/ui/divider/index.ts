import Block from '@/modules/block';
import { template } from './template';
import type { IDividerProps } from './types';
import type { IBlockWrapperProps } from '@/modules/block/types';

export default class Divider extends Block {
  constructor(props: IDividerProps = {}, wrapperProps: IBlockWrapperProps = {}) {
    const classes = ['ui-divider', ...(wrapperProps.classes ?? [])];
    const styles = [...(wrapperProps.styles ?? [])];

    if (props.color) {
      classes.push(`ui-divider_${props.color}`);
    }

    if (props.size) {
      styles.push(`border-width:${props.size}px`);
    }

    super('div', props, {
      ...wrapperProps,
      classes,
      styles
    });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
