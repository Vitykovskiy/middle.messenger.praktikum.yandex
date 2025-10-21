import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface ICardProps extends IBlockProps {
  header?: string | Block | Block[] | null;
  content?: string | Block | Block[] | null;
  actions?: Block | Block[] | null;
  isCloseBtn?: boolean;
}
