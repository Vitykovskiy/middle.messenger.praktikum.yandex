import Block from '@/modules/block';
import { template } from './template';
import type { IButtonProps } from './types';
import Icon from '../icon';
import { resolveConditionalProps } from '@/modules/block/helpers';
import { merge } from '@/utils/helpers';

export default class Button extends Block {
  constructor(props: IButtonProps) {
    const {
      variant,
      color,
      label,
      type = 'button',
      iconName,
      iconSize,
      iconSlot,
      underline,
      events = {},
      ...rest
    } = props;

    const icon = iconName ? new Icon({ iconName, size: iconSize }) : iconSlot;
    const isIconBtn = !!icon && !label;

    super(
      merge(
        {
          tagName: 'button',
          icon,
          label,
          wrapperProps: {
            type,
            classes: resolveConditionalProps([
              ['ui-btn'],
              [`ui-btn_${variant ? variant : isIconBtn ? 'icon' : 'filled'}`],
              [`ui-btn_${color ?? 'primary'}`, !isIconBtn],
              ['ui-btn_underline', !!underline],
              ['ui-btn_rounded', isIconBtn]
            ])
          }
        },
        rest
      )
    );

    merge(events, { click: this._click.bind(this) });

    this.setProps({ events });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }

  public click(_event?: Event): void {}

  private _click(_event: Event): void {
    this.click(_event);
  }
}
