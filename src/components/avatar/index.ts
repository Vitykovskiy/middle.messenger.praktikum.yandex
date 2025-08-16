import Block from '@/modules/block';
import { template } from './template';
import type { IBlockWrapperProps } from '@/modules/block/types';
import type { IAvatarProps } from './types';

export class Avatar extends Block {
  constructor(props: IAvatarProps = {}, wrapperProps: IBlockWrapperProps = {}) {
    const classes = ['avatar', ...(wrapperProps.classes ?? [])];
    const styles = [...(wrapperProps.styles ?? [])];
    styles.push(`width: ${props.size ?? 24}px`);

    super('div', props, { ...wrapperProps, classes, styles });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
