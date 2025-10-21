import Block from '@/modules/block';
import { withModal } from '@/services/modal/decorator';
import modalService from '@/services/modal';
import { MODAL_WINDOW_ID } from './constants';
import type { IModalProps } from './types';
import { template } from './template';

@withModal
export default class Modal extends Block {
  constructor() {
    super({
      wrapperProps: { id: MODAL_WINDOW_ID, classes: ['modal', 'modal_inactive'] }
    });

    this.setProps({ events: { click: this._onClick.bind(this) } });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }

  private _onClick(event: Event): void {
    this._handleOutsideClick(event);
  }

  private _handleOutsideClick(event: Event): void {
    if ((this.props as IModalProps).isCloseOnOutsideClick && this._isModal(event.target)) {
      modalService.close();
    }
  }

  private _isModal(el: unknown): boolean {
    return el instanceof HTMLElement && el.getAttribute('id') === MODAL_WINDOW_ID;
  }
}
