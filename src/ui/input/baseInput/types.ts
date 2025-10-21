import type { IBlockProps } from '@/modules/block/types';
import type EventBus from '@/modules/event-bus';

export interface IBaseInputProps extends IBlockProps {
  name?: string;
  value?: string | null;
  type?: 'number' | 'password' | 'text' | 'file';
  placeholder?: string | null;
  parentEventBus?: EventBus;
  validators?: ((value: string) => string | null)[];
}
