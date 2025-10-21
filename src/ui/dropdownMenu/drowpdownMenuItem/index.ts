import Block from '@/modules/block';
import { Icon } from '@/ui';
import { template } from './template';
import { merge } from '@/utils/helpers';
import type { IDropdownItemProps } from './types';
import type { IBlockProps } from '@/modules/block/types';
import modalService from '@/services/modal';

export class DropdownMenuItem extends Block {
  constructor(props: IDropdownItemProps) {
    const { icon: iconName = '', color = 'primary', title, callback, ...rest } = props;

    const icon = iconName ? new Icon({ color, size: 25, iconName, type: 'flat' }) : undefined;

    const baseProps: IBlockProps = {
      icon,
      title,
      events: {
        click: () => {
          modalService.close();
          callback();
        }
      },
      wrapperProps: { classes: ['ui-dropdown-item'] }
    };

    super(merge(baseProps, rest));
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
