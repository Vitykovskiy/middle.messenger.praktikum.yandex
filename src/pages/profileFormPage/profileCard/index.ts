import type { IBlockWrapperProps } from '@/modules/block/types';
import { Card } from '@/ui';
import type { IProfileCardProps } from './types';
import { ViewFormItem } from '@/components/viewFormItem';
import type { IViewFormItemProps } from '@/components/viewFormItem/types';

export class ProfileCard extends Card {
  constructor(props: IProfileCardProps, options: IBlockWrapperProps) {
    super(props, options);
  }

  public componentDidUpdate(oldProps: IProfileCardProps, newProps: IProfileCardProps): boolean {
    if (oldProps.title !== newProps.title) {
      this.setProps({ title: newProps.title });
    }

    if (Array.isArray(this.children.content)) {
      this.children.content.forEach((viewItem) => {
        if (!(viewItem instanceof ViewFormItem)) {
          return;
        }

        const props = viewItem.props as IViewFormItemProps;

        if (props.key) {
          viewItem.setProps({
            value: newProps.userData[props.key]
          });
        }
      });
    }
    return true;
  }
}
