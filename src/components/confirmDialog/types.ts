import type { IBlockProps } from '@/modules/block/types';

export interface IConfirmDialogProps extends IBlockProps {
  title?: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
}
