import type { IBlockProps } from '@/modules/block/types';
import type EventBus from '@/modules/event-bus';

export interface IBaseInputProps extends IBlockProps {
  name?: string;
  value?: string;
  type?: 'number' | 'password' | 'text';
  placeholder?: string;
  parentEventBus?: EventBus;
  validator?: (value: string) => string | null;
}
