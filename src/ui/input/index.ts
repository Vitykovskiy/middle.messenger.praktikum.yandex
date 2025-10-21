import Block from '@/modules/block';
import Divider from '@/ui/divider';
import { template } from './template';
import { BaseInput } from './baseInput';
import type { IInputProps } from './types';
import EventBus from '@/modules/event-bus';
import { isEqual, merge } from '@/utils/helpers';
import { isHTMLInput } from '@/modules/block/helpers';

export default class Input extends Block {
  private _validators?: ((value: string) => string | null)[];

  constructor(props: IInputProps) {
    const { value, type, name, placeholder = '', validators, ...rest } = props;

    const parentEventBus = new EventBus();
    const divider = new Divider({
      color: 'primary',
      wrapperProps: { styles: ['margin-top: 7px'] }
    });

    const input = new BaseInput({
      value,
      type,
      name,
      placeholder,
      parentEventBus
    });

    super(merge({ input, divider, wrapperProps: { classes: [['ui-input']] } }, rest));

    this._validators = validators;
    this._initValidators(parentEventBus);
    input.onChange = (v) => this.onChange(v);
    input.onInput = (v) => this.onInput(v);
  }

  public validate(): boolean {
    if (!this._validators) {
      return true;
    }

    const techInput = this.element.querySelector('input');

    if (!isHTMLInput(techInput)) {
      throw new Error(`Input field ${this.props.name} not found`);
    }

    const value = techInput.value;

    for (const validator of this._validators) {
      const error = validator(value);
      if (error) {
        this.setProps({ error });
        return false;
      }
    }

    return true;
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }

  public onUpdate(oldProps: IInputProps, newProps: IInputProps): boolean {
    if (isEqual(oldProps.value, newProps.value)) return true;

    const input = this.children.input;
    if (!BaseInput.isBaseInput(input)) {
      throw new Error('BaseInput not found');
    }

    const htmlInputElement = input.getContent();
    if (!isHTMLInput(htmlInputElement)) {
      throw new Error('The BaseInput does not contain an HtmlInputElement');
    }

    htmlInputElement.value = newProps.value ?? '';
    return true;
  }

  public onChange(_value: string | null): void {}

  public onInput(_value: string | null): void {}

  private _initValidators(eventBus: EventBus): void {
    if (!this._validators || !this._validators.length) {
      return;
    }

    eventBus.on('blur', (event: Event) => {
      if (isHTMLInput(event.target)) {
        const value = event.target.value;
        const error = this._getInputError(value);
        this.setProps({ value, error });
      }
    });
  }

  private _getInputError(inputValue: string): string | null {
    if (!this._validators) {
      return null;
    }

    for (const validator of this._validators) {
      const error = validator(inputValue);
      if (error) {
        return error;
      }
    }

    return null;
  }
}
