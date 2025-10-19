import type Block from '@/modules/block';
import type { ICardProps } from '@/ui/card/types';
import type { IUserData } from '../types';

export interface IProfileCardProps extends Omit<ICardProps, 'contentSlot'> {
  userData: IUserData;
  contentSlot?: Block[];
}
