import { Button, Card, UIText } from '@/ui';
import type { IConfirmDialogProps } from './types';
import { UIElement } from '@/ui/element';

export class ConfirmDialog extends Card {
  constructor(options: IConfirmDialogProps) {
    const { title, text, confirmLabel, cancelLabel, confirmCallback, cancelCallback } = options;
    const header = new UIText({
      value: title,
      wrapperProps: { classes: ['confirm-dialog__header'] }
    });
    const confirmBtn = new Button({
      label: confirmLabel ?? 'Подтвердить',
      wrapperProps: { styles: ['width:200px'] }
    });
    confirmBtn.click = confirmCallback;

    const cancelBtn = new Button({
      label: cancelLabel ?? 'Отмена',
      variant: 'text',
      color: 'accent'
    });

    cancelBtn.click = cancelCallback;

    const actions = new UIElement({
      content: [confirmBtn, cancelBtn],
      wrapperProps: { classes: ['confirm-dialog__actions'] }
    });

    super({
      header,
      content: text,
      actions,
      wrapperProps: { classes: ['confirm-dialog'] }
    });
  }
}
