import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IUIElementProps extends IBlockProps {
  content?: Block[] | Block | string | null;
}
