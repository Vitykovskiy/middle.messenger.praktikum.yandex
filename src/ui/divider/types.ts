import type { IBlockProps } from '@/modules/block/types';

export interface IDividerProps extends IBlockProps {
  color?: 'secondary' | 'primary';
  size?: number;
}
