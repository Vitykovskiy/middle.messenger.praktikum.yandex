import type { PlainObject } from './types';

const PROPERTY_KEY_REG_EXP = /^[A-Za-z_-][A-Za-z0-9_-]*$/;

/**
 * Returns the same object
 *
 * const object = {'a' : 1};
 *
 * identity(object) === object; // => true
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Returns the last array element
 */
export function last<T>(list: Array<T>): T | undefined {
  return Array.isArray(list) ? list[list.length - 1] : undefined;
}

/**
 * Returns the first array element
 */
export function first<T>(list: Array<T>): T | undefined {
  return Array.isArray(list) ? list[0] : undefined;
}

/**
 * Returns numerical sequences with a given step
 *
 * range(4); // => [0, 1, 2, 3]
 *
 * range(-4); // => [0, -1, -2, -3]
 *
 * range(1, 5); // => [1, 2, 3, 4]
 *
 * range(0, 20, 5); // => [0, 5, 10, 15]
 *
 * range(0, -4, -1); // => [0, -1, -2, -3]
 *
 * range(1, 4, 0); // => [1, 1, 1]
 *
 * range(0); // => []
 */
export function range(...args: number[]): number[] {
  let start = 0;
  let end;
  let step = 1;

  switch (args.length) {
    case 1:
      end = args[0];
      step = end / Math.abs(end || 1);
      break;
    case 2:
      start = args[0];
      end = args[1];
      break;
    default:
      start = args[0];
      end = args[1];
      step = args[2];
  }

  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(step)) {
    throw new Error('Error >> Wrong parammeters');
  }

  const elementsNumber = Math.abs(Math.floor((end - start) / (step || 1)));

  const elementsKeys = [...new Array(elementsNumber).keys()];

  return elementsKeys.length ? elementsKeys.map((key) => start + key * step) : [];
}

export function rangeRight(...args: number[]): number[] {
  return range(...args).reverse();
}

export function isEmpty(value: unknown): boolean {
  return (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    !value ||
    (Array.isArray(value) && !value.length)
  );
}

export function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function merge<A extends PlainObject, B extends PlainObject>(target: A, source: B): A & B;

export function merge(target: PlainObject, source: PlainObject): object {
  Object.entries(source).forEach(([key, value]) => {
    const targetVal = target[key];

    if (Array.isArray(targetVal) && Array.isArray(value)) {
      const set = new Set(targetVal);
      for (const item of value) set.add(item);
      target[key] = Array.from(set);
    } else if (!isPlainObject(target[key]) || !isPlainObject(source[key])) {
      target[key] = value;
    } else {
      merge(target[key], source[key]);
    }
  });

  return target;
}

/**
 * const obj = {};
 *
 * set(obj, 'a.b.c', 1); // {a: {b: {c: 1}}}
 */
export function set(target: PlainObject, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');

  const source = keys.reduceRight((acc, key) => {
    if (!PROPERTY_KEY_REG_EXP.test(key)) {
      throw new Error(`Invalid property name: ${key}`);
    }

    return { [key]: acc };
  }, value) as Record<string, unknown>;

  return merge(target, source);
}

/**
 * trim('  abc  '); // => 'abc'
 *
 * trim('-_-abc-_-', '_-'); // => 'abc'
 *
 * ['  foo  ', '  bar  '].map(value => trim(value)); // => ['foo', 'bar']
 */
export function trim(string: string, chars?: string): string {
  const str = ' ' + string + ' ';

  if (chars === undefined) {
    return string.trim();
  }

  if (!string || !chars) {
    return string || '';
  }

  const regFirst = new RegExp(` ${chars}`, 'gi');
  const regSecond = new RegExp(`${chars} `, 'gi');

  return str.replace(regFirst, '').replace(regSecond, '').trim();
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (isArrayOrObject(a) !== isArrayOrObject(b)) {
    return false;
  }

  if (!(isArrayOrObject(a) && isArrayOrObject(b))) {
    return a === b;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const [key, aValue] of Object.entries(a)) {
    const bValue = b[key as keyof typeof b];
    if (isArrayOrObject(aValue) && isArrayOrObject(bValue)) {
      if (isEqual(aValue as PlainObject, bValue as PlainObject)) {
        continue;
      }
      return false;
    }

    if (aValue !== bValue) {
      return false;
    }
  }

  return true;
}

export function cloneDeep<T extends object = object>(
  obj: T
): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
  const proxyObj: PlainObject = {};

  if (Array.isArray(obj)) {
    return obj.map((value) => (isArrayOrObject(value) ? cloneDeep(value) : value));
  }

  if (obj instanceof Date) {
    return new Date(obj.valueOf());
  }

  if (obj instanceof Set) {
    const copy = new Set();

    obj.forEach((v) => copy.add(cloneDeep(v)));

    return copy;
  }

  if (obj instanceof Map) {
    const copy = new Map();

    obj.forEach((v, k) => copy.set(k, cloneDeep(v)));

    return copy;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (isArrayOrObject(value)) {
      proxyObj[key] = cloneDeep(value);
    } else {
      proxyObj[key] = value;
    }
  }

  return proxyObj;
}

export function queryStringify(data?: unknown): string {
  if (!data || !isPlainObject(data)) {
    console.warn('>> queryStringify: data must be an object', data);
    return '';
  }

  const parts: string[] = [];

  const getKey = (key: string, parentKey?: string): string => {
    return parentKey ? `${parentKey}[${key}]` : key;
  };

  const build = (keyPath: string, val: unknown): void => {
    if (isArrayOrObject(val)) {
      for (const [k, v] of Object.entries(val)) {
        build(getKey(k, keyPath), v);
      }
    } else {
      parts.push(`${keyPath}=${encodeURIComponent(String(val))}`);
    }
  };

  build('', data);

  return parts.join('&');
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
