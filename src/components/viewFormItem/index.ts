import Block from '@/modules/block';
import type { IViewFormItemProps } from './types';
import type { IBlockWrapperProps } from '@/modules/block/types';
import { template } from './template';

export class ViewFormItem extends Block {
  constructor(props: IViewFormItemProps, options: IBlockWrapperProps = { classes: ['view-form'] }) {
    super('div', props, options);
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
