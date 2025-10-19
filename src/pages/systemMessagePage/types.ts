import type { IBlockProps } from '@/modules/block/types';

export interface ISystemMessageProps extends IBlockProps {
  title: string;
  message: string;
}
