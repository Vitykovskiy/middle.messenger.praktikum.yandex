import Block from '@/modules/block';
import type { IBaseInputProps } from './types';
import { merge } from '@/utils/helpers';
import { isHTMLInput } from '@/modules/block/helpers';

// Чистый input без обёртки для проксирования blur через EventBus
export class BaseInput extends Block {
  public static isBaseInput = (value: unknown): value is BaseInput => value instanceof BaseInput;

  private _validators?: ((value: string) => string | null)[];

  constructor(props: IBaseInputProps) {
    const { name, parentEventBus, validators, placeholder, type, value, ...rest } = props;

    const events = {
      blur: (event: Event) => {
        parentEventBus?.emit('blur', event);
      },
      change: (event: Event) => {
        if (!isHTMLInput(event.target)) {
          return;
        }

        if (type === 'file') {
          this.onChangeFiles(event.target.files);
        } else {
          this.onChange(event.target.value);
        }
      },
      input: (event: Event) => {
        if (!isHTMLInput(event.target)) {
          return;
        }

        this.onInput(event.target.value);
      }
    };

    super(
      merge(
        {
          tagName: 'input',
          events,
          wrapperProps: { id: name, name, placeholder, type, value, classes: ['ui-input__item'] }
        },
        rest
      )
    );

    this._validators = validators;
  }

  public get value() {
    return (this.getContent() as HTMLInputElement).value;
  }

  public clear() {
    (this.getContent() as HTMLInputElement).value = '';
  }

  public validate(): boolean {
    if (!this._validators) {
      return true;
    }

    if (!isHTMLInput(this.element)) {
      throw new Error(`Поле ввода ${this.props.name} не найдено`);
    }

    const value = this.element.value;

    for (const validator of this._validators) {
      const error = validator(value);
      if (error) {
        this.setProps({ error });
        return false;
      }
    }

    return true;
  }

  public onChangeFiles(_files: FileList | null): void {}

  public onChange(_value: string | null): void {}

  public onInput(_value: string | null): void {}

  public render(): DocumentFragment {
    return this.compile('', this.props);
  }
}
