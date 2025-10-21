import type { IUser } from '@/api/authApi/types';
import type { IBlockProps } from '@/modules/block/types';

export interface IProfilePageProps extends IBlockProps {
  user?: IUser;
}
