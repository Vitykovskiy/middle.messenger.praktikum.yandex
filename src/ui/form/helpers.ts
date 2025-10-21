export function isFormElement(value: unknown): value is HTMLFormElement {
  return value instanceof HTMLFormElement;
}
