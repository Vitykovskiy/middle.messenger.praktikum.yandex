import Block from '@/modules/block';
import { template } from './template';
import type { IFormProps } from './types';
import type { IBlockChildren } from '@/modules/block/types';
import Input from '@/ui/input';
import { BaseInput } from '../input/baseInput';
import { isFormElement } from './helpers';
import { merge } from '@/utils/helpers';

export default class Form extends Block {
  constructor(props: IFormProps) {
    const { events = {}, ...rest } = props;

    super(merge({ tagName: 'form' }, rest));

    merge(events, { submit: this._onSubmit });

    this.setProps({ events });
  }

  public render(): DocumentFragment {
    return this.compile(template, this.props);
  }

  public validate(): boolean {
    const inputs = this._getAllNestedInputs();
    const validateResult = inputs.map((input) => input.validate());
    return validateResult.every((value) => value);
  }

  public getValues(): Record<string, FormDataEntryValue> {
    const form = this.element as HTMLFormElement;
    const formData = new FormData(form);
    const values: Record<string, FormDataEntryValue> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    return values;
  }

  public onSubmit(_form: HTMLFormElement): void {}

  private _onSubmit = (event: Event): void => {
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    if (!isFormElement(event.target)) {
      return;
    }

    this.onSubmit(event.target);
  };

  private _getAllNestedInputs(): (Input | BaseInput)[] {
    const result: (Input | BaseInput)[] = [];

    const findInputsRecursively = (children: IBlockChildren) => {
      Object.values(children).forEach((child) => {
        if (Array.isArray(child)) {
          child.forEach((c) => {
            if (c instanceof Input || c instanceof BaseInput) {
              result.push(c);
            } else {
              findInputsRecursively(c.children);
            }
          });
        } else if (child instanceof Input || child instanceof BaseInput) {
          result.push(child);
        } else {
          findInputsRecursively(child.children);
        }
      });
    };

    findInputsRecursively(this.children);
    return result;
  }
}
