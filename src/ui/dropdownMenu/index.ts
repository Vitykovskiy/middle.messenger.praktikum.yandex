import Block from '@/modules/block';
import { template } from './template';
import type { IDropdownMenuProps } from './types';
import { DropdownMenuItem } from './drowpdownMenuItem';
import type { IBlockProps } from '@/modules/block/types';

export default class DropdownMenu extends Block {
  constructor(props: IDropdownMenuProps) {
    const { items: itemsOptions } = props;

    const items = itemsOptions.map((itemProps) => new DropdownMenuItem(itemProps));

    super({ items, wrapperProps: { classes: ['ui-dropdown-menu'] } });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }

  public onUpdate(_oldProps: IBlockProps, _newProps: IBlockProps): boolean {
    return true;
  }
}
