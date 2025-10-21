import Block from '@/modules/block';
import { template } from './template';
import type { ICardProps } from './types';
import { merge } from '@/utils/helpers';
import Button from '../button';

export default class Card extends Block {
  constructor(props: ICardProps) {
    const closeBtn = new Button({
      color: 'primary',
      iconName: 'close',
      iconSize: 15,
      wrapperProps: { styles: ['padding: 4px'] }
    });

    super(merge({ closeBtn, wrapperProps: { classes: [['ui-card']] } }, props));
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
