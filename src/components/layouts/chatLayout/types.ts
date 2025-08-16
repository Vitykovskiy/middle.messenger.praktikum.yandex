import type Block from '@/modules/block';
import type { IBlockProps } from '@/modules/block/types';

export interface IChatLayoutProps extends IBlockProps {
  sidebarHeader: Block;
  sidebarBody: Block;
  chat?: Block;
}
