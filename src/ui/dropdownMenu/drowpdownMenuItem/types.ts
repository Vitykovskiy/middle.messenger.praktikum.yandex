import type { IBlockProps } from '@/modules/block/types';
import type { IIconProps } from '@/ui/icon/types';

export interface IDropdownItemProps extends IBlockProps {
  title?: string;
  icon?: string;
  color?: IIconProps['color'];
  callback: () => void;
}
