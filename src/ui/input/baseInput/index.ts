import Block from '@/modules/block';
import type { IBaseInputProps } from './types';
import type { IBlockWrapperProps } from '@/modules/block/types';

// Чистый input без обёртки для проксирования blur через EventBus
export class BaseInput extends Block {
  private _validator?: (value: string) => string | null;

  constructor(props: IBaseInputProps, wrapperProps: IBlockWrapperProps = {}) {
    const { name, parentEventBus, events: customEvents = {}, validator, ...rest } = props;

    const onBlur = (event: Event) => {
      parentEventBus?.emit('blur', event);
    };

    const classes = ['ui-input__item', ...(wrapperProps.classes ?? [])];

    const events = {
      blur: onBlur,
      ...customEvents
    };

    super(
      'input',
      { events },
      {
        id: name,
        name,
        classes,
        ...rest
      }
    );

    this._validator = validator;
  }

  public render(): DocumentFragment {
    return this.compile('', this.props);
  }

  public validate(): boolean {
    if (!this._validator) {
      return true;
    }

    if (!(this.element instanceof HTMLInputElement)) {
      throw new Error(`Поле ввода ${this.props.name} не найдено`);
    }

    const value = this.element.value;
    const error = this._validator(value);

    return !error;
  }
}
