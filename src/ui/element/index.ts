import Block from '@/modules/block';
import type { IUIElementProps } from './types';
import { template } from './template';

export class UIElement extends Block {
  constructor(props: IUIElementProps) {
    super(props);
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
