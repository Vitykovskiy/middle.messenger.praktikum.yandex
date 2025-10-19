export function queryStringify(data?: Record<string, unknown>): string {
  if (!data) return '';

  return (
    '?' +
    Object.entries(data)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&')
  );
}
