import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IAppLayoutProps extends IBlockProps {
  content?: Block | Block[];
  sidebar?: Block | Block[];
}
