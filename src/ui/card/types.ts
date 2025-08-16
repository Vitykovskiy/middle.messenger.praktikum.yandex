import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface ICardProps extends IBlockProps {
  title?: string;
  titleSlot?: Block | Block[];
  content?: string;
  contentSlot?: Block | Block[];
  actions?: Block | Block[];
}
