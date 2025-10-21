import { store } from '@/modules/store';
import { MODAL_STORE_KEY } from './constants';
import type { IModalOptions } from '@/ui/modal/types';
import { isBlock, isBlockArray } from '@/modules/block/helpers';

function open(params?: IModalOptions): void {
  store.set(MODAL_STORE_KEY, { isActive: true, isHidden: false, ...params });
}

function close(): void {
  const { content } = store.get(MODAL_STORE_KEY) as { content?: unknown };

  if (isBlock(content)) {
    content.dispatchComponentDidUnmount();
  } else if (isBlockArray(content)) {
    content.forEach((value) => {
      value.dispatchComponentDidUnmount();
    });
  }

  store.set(MODAL_STORE_KEY, { isActive: false });
}

function setProps(params?: IModalOptions): void {
  store.set(MODAL_STORE_KEY, params);
}

export default {
  open,
  close,
  setProps
};
