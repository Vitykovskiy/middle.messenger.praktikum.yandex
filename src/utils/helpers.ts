export function compareObjects(oldValue: object, newValue: object): boolean {
  const flattedOldValueString = getFlattedKeyValuePairs(oldValue).toString();
  const flattedNewValueString = getFlattedKeyValuePairs(newValue).toString();
  return flattedOldValueString === flattedNewValueString;
}

export function copy<T>(target: T): T {
  return JSON.parse(JSON.stringify(target));
}

function getFlattedKeyValuePairs(
  object: object,
  accumulator: [string, unknown][] = []
): [string, unknown][] {
  const result = [...accumulator];

  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      result.push(...getFlattedKeyValuePairs(value, result));
    } else {
      result.push([key, value]);
    }
  });

  return result.sort((a, b) => a[0].localeCompare(b[0]));
}
