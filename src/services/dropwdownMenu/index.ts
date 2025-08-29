import modal from '@/services/modal';
import { DropdownMenu } from '@/ui';
import { isPointerEvent } from './helpers';
import { cloneDeep, merge } from '@/utils/helpers';
import type { IPosition } from './types';
import type { IBlockProps } from '@/modules/block/types';
import type { IDropdownItemProps } from '@/ui/dropdownMenu/drowpdownMenuItem/types';

export class DropwdownMenuActivator {
  private _dropdownMenu: DropdownMenu;
  private _position?: IPosition;

  constructor(items: IDropdownItemProps[]) {
    this._dropdownMenu = new DropdownMenu({ items });
  }

  public activate(event?: Event): void {
    if (isPointerEvent(event)) {
      // Сначала отрисуем элемент в DOM с visibility: hidden, чтобы определить координаты размещения по размеру
      // контейнера и месту вызова, после применяем стили с позицией и показываем
      this._putDropdownMenuToDOM();
      this._calculatePosition(event);
      this._applyPositionStyles();
    }

    modal.open({ content: this._dropdownMenu, isCloseOnOutsideClick: true });
  }

  private _putDropdownMenuToDOM(): void {
    modal.setProps({
      isActive: true,
      isHidden: true,
      isCloseOnOutsideClick: true,
      content: this._dropdownMenu
    });
  }

  private _applyPositionStyles(): void {
    const newProps: IBlockProps = {
      wrapperProps: { styles: this._resolvePositionStyles(this._position) }
    };
    const oldProps = cloneDeep(this._dropdownMenu.props);

    this._dropdownMenu.setProps(merge({ ...oldProps }, newProps));
  }

  private _resolvePositionStyles(position?: IPosition): string[] {
    if (!position) return [];
    const { x, y } = position;
    const result = ['position:absolute'];
    if (x != null) result.push(`left:${x}px`);
    if (y != null) result.push(`top:${y}px`);
    return result;
  }

  private _calculatePosition(event: PointerEvent): void {
    const { clientX, clientY, offsetX, offsetY } = event;
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const { clientHeight: dropdownHeight, clientWidth: dropdownWidth } =
      this._dropdownMenu.getContent();

    const activatorWidth = (event.target as HTMLElement)?.clientWidth || 0;
    const activatorHeight = (event.target as HTMLElement)?.clientHeight || 0;

    const activatorXStart = clientX - offsetX;
    const activatorXEnd = activatorXStart + activatorWidth;

    const activatorYStart = clientY - offsetY;
    const activatorYEnd = activatorYStart + activatorHeight;

    const isXOverflow = activatorXStart + dropdownWidth > windowWidth;
    const isYOverflow = activatorYStart + dropdownHeight > windowHeight;

    const x = isXOverflow ? activatorXEnd - dropdownWidth : activatorXStart;
    const y = isYOverflow ? activatorYStart - dropdownHeight : activatorYEnd;

    this._position = { x, y };
  }
}
