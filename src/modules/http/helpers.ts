export function parseResponse<T>(xhr: XMLHttpRequest): T {
  if (isJsonResponse(xhr)) {
    try {
      return JSON.parse(xhr.response) as T;
    } catch {
      return xhr.response as T;
    }
  }

  if (isTextResponse(xhr)) {
    return xhr.response as string as T;
  }

  return xhr.response as T;
}

export function isJsonResponse(xhr: XMLHttpRequest): boolean {
  const contentType = xhr.getResponseHeader('Content-Type')?.toLowerCase();

  return !!contentType && contentType.includes('json');
}

export function isTextResponse(xhr: XMLHttpRequest): boolean {
  const contentType = xhr.getResponseHeader('Content-Type')?.toLowerCase();

  return !!contentType && contentType.includes('text/');
}
