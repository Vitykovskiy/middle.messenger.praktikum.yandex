import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IFormProps extends IBlockProps {
  content?: Block | Block[];
}
