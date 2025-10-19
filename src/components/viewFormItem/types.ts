import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IViewFormItemProps extends IBlockProps {
  label?: string;
  labelSlot?: Block | string;
  value?: string;
}
