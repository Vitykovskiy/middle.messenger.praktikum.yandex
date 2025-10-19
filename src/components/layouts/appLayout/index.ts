import Block from '@/modules/block';
import type { IAppLayoutProps } from './types';
import { template } from './template';

export default class AppLayout extends Block {
  constructor(props: IAppLayoutProps = {}) {
    super('main', { ...props }, { classes: ['main-layout'] });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
