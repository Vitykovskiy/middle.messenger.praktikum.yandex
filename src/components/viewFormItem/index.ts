import Block from '@/modules/block';
import { template } from './template';
import { merge } from '@/utils/helpers';
import type { IViewFormItemProps } from './types';

export class ViewFormItem extends Block {
  constructor(props: IViewFormItemProps) {
    super(merge({ wrapperProps: { classes: ['view-form'] } }, props));
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
