import Block from '@/modules/block';
import { Modal } from '@/ui';
import { SidebarButton } from '@/components/sidebarBtn';
import { template } from './template';

export default class AppLayout extends Block {
  constructor() {
    const returnBtn = new SidebarButton();
    const modal = new Modal();

    super({ modal, sidebar: returnBtn, wrapperProps: { classes: ['app-layout'] } });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
