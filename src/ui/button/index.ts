import Block from '@/modules/block';
import { template } from './template';
import type { IButtonProps } from './types';
import type { IBlockWrapperProps } from '@/modules/block/types';

export default class Button extends Block {
  constructor(props: IButtonProps, options: IBlockWrapperProps = {}) {
    const { variant, color, label, type = 'button' } = props;
    const classes = ['ui-btn'];

    classes.push(`ui-btn_${variant ?? 'filled'}`);

    classes.push(`ui-btn_${color ?? 'primary'}`);

    const mergedClasses = classes.concat(options.classes ?? []);

    super('button', { label }, { type, classes: mergedClasses, styles: options.styles ?? [] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
