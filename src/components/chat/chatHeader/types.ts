import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IChatHeaderProps extends IBlockProps {
  avatar?: Block;
  name?: string;
}
