import type { IUser } from '@/api/authApi/types';
import type { IBlockProps } from '@/modules/block/types';

export interface IChatsListProps extends IBlockProps {
  users: IUser[];
}
