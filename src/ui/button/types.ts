import type { IBlockProps } from '@/modules/block/types';

export interface IButtonProps extends IBlockProps {
  label?: string;
  icon?: string;
  variant?: 'filled' | 'text';
  color?: 'secondary' | 'primary' | 'accent';
  type?: 'submit' | 'button';
}
