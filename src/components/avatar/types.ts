import type { IBlockProps } from '@/modules/block/types';

export interface IAvatarProps extends IBlockProps {
  src?: string | null;
  size?: number;
}
