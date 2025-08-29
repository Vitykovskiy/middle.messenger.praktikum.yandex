import Block from '@/modules/block';
import type { IUITextProps } from './types';
import { template } from './template';

export default class UIText extends Block {
  constructor(props: IUITextProps) {
    super({ tagName: 'span', ...props });
  }

  render() {
    return this.compile(template, this.props);
  }
}
