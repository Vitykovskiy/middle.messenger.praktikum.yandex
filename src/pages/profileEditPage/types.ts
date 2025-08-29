import type { IUser } from '@/api/authApi/types';
import type { IBlockProps } from '@/modules/block/types';

export interface IEditProfilePageProps extends IBlockProps {
  user?: IUser;
}

export interface IUserFormData {
  email: string | null;
  login: string | null;
  firstName: string | null;
  secondName: string | null;
  displayName: string | null;
  phone: string | null;
  avatar: string | null;
}
