import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IButtonProps extends IBlockProps {
  label?: string;
  color?: 'secondary' | 'primary' | 'accent';
  variant?: 'filled' | 'text' | 'icon';
  type?: 'submit' | 'button';
  underline?: boolean;
  iconName?: string;
  iconSize?: number;
  iconSlot?: Block;
}
