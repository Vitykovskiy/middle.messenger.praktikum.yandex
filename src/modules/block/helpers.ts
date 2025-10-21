import Block from '.';

type ConditionalTuple = [string] | [string, boolean];

export function resolveConditionalProps(values: ConditionalTuple[]): string[] {
  return values?.filter(([_, condition]) => condition !== false).map(([element, _]) => element);
}

export function isHTMLInput(value: unknown): value is HTMLInputElement {
  return value instanceof HTMLInputElement;
}

export function isBlock(value: unknown): value is Block {
  return value instanceof Block;
}

export function isBlockArray(value: unknown): value is Block[] {
  return Array.isArray(value) && !!value.length && value.every((val) => isBlock(val));
}
