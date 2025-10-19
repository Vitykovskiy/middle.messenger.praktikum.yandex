import Block from '@/modules/block';
import Divider from '@/ui/divider';
import { template } from './template';
import { BaseInput } from './baseInput';
import type { IBlockWrapperProps } from '@/modules/block/types';
import type { IInputProps } from './types';
import EventBus from '@/modules/event-bus';

export default class Input extends Block {
  private _validator?: (value: string) => string | null;

  constructor(props: IInputProps, options: IBlockWrapperProps = {}) {
    const { value, type, name, placeholder = '', validator, ...rest } = props;

    const parentEventBus = new EventBus();

    // подписка на blur
    if (validator) {
      parentEventBus.on('blur', (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          const newValue = event.target.value;
          const error = validator(newValue);
          this.setProps({ value: newValue, error });
        }
      });
    }

    const divider = new Divider({ color: 'primary' }, { styles: ['margin-top: 7px'] });

    const input = new BaseInput({
      value,
      type,
      name,
      placeholder,
      parentEventBus
    });

    const classes = ['ui-input', ...(options.classes ?? [])];
    const styles = [...(options.styles ?? [])];

    super(
      'div',
      {
        ...rest,
        input,
        divider
      },
      { classes, styles }
    );

    this._validator = validator;
  }

  public validate(): boolean {
    if (!this._validator) {
      return true;
    }

    const techInput = this.element.querySelector('input');

    if (!techInput || !(techInput instanceof HTMLInputElement)) {
      throw new Error(`Поле ввода ${this.props.name} не найдено`);
    }

    const value = techInput.value;
    const error = this._validator(value);

    this.setProps({ error });
    return !error;
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
