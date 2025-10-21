import type Block from '@/modules/block';
import { isBlock } from '@/modules/block/helpers';
import type { IBlockProps } from '@/modules/block/types';

export interface IModalProps extends IBlockProps {
  content?: Block;
  isCloseOnOutsideClick?: boolean;
}

export interface IModalOptions {
  isActive?: boolean;
  isHidden?: boolean;
  isShaded?: boolean;
  isCloseOnOutsideClick?: boolean;
  content: Block;
}

export function isModalOptions(value: unknown): value is IModalOptions {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as IModalOptions;

  return (
    (obj.isActive === undefined || typeof obj.isActive === 'boolean') &&
    (obj.isHidden === undefined || typeof obj.isHidden === 'boolean') &&
    (obj.isShaded === undefined || typeof obj.isShaded === 'boolean') &&
    (obj.isCloseOnOutsideClick === undefined || typeof obj.isCloseOnOutsideClick === 'boolean') &&
    (obj.content === undefined || isBlock(obj.content))
  );
}
