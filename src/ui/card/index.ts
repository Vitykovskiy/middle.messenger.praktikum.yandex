import Block from '@/modules/block';
import { template } from './template';
import type { ICardProps } from './types';
import type { IBlockWrapperProps } from '@/modules/block/types';

export default class Card extends Block {
  constructor(props: ICardProps, options: IBlockWrapperProps = {}) {
    super('div', props, { classes: ['ui-card', ...(options.classes ?? [])], ...options });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
