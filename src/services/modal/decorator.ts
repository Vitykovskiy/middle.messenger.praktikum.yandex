import { connect } from '@/modules/connect';
import { isModalOptions, type IModalOptions, type IModalProps } from '../../ui/modal/types';
import { MODAL_STORE_KEY } from '@/services/modal/constants';
import { resolveConditionalProps } from '@/modules/block/helpers';

export const withModal = connect((state) => {
  const modalOptions = state[MODAL_STORE_KEY];

  if (!isModalOptions(modalOptions)) {
    return {};
  }

  return resolveProp(modalOptions);
});

function resolveProp(options: IModalOptions): IModalProps {
  const { content, isActive, isHidden, isShaded, isCloseOnOutsideClick } = options;

  return {
    content,
    isCloseOnOutsideClick,
    wrapperProps: {
      classes: resolveConditionalProps([
        ['modal'],
        ['modal_inactive', !isActive],
        ['modal_hidden', !!isHidden],
        ['modal_shaded', !!isShaded]
      ])
    }
  };
}
