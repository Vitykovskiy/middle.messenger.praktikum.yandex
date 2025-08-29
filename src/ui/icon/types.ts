import type { IBlockProps } from '@/modules/block/types';

export interface IIconProps extends IBlockProps {
  iconName: string;
  size?: number;
  color?: 'secondary' | 'primary' | 'accent';
  type?: 'outline' | 'filled' | 'flat';
}
