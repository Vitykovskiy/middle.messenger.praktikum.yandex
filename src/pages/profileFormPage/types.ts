import type { IBlockProps } from '@/modules/block/types';

export interface IUserData extends IBlockProps {
  email: string;
  login: string;
  firstName: string;
  secondName: string;
  displayName: string;
  phone: string;
  password: string;
  avatar?: string;
}
