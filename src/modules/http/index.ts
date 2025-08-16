import { queryStringify } from './helpers';
import { METHODS, type Options, type OptionsWithoutMethod } from './types';

export class HTTPTransport {
  get<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.requesthWithRetry<TResponse>(
      url,
      { ...options, method: METHODS.GET },
      options.timeout
    );
  }

  post<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.requesthWithRetry(url, { ...options, method: METHODS.POST }, options.timeout);
  }

  put<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.requesthWithRetry(url, { ...options, method: METHODS.PUT }, options.timeout);
  }

  delete<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.requesthWithRetry(url, { ...options, method: METHODS.DELETE }, options.timeout);
  }

  request<TResponse>(url: string, options: Options = {}, timeout = 5000): Promise<TResponse> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);
      xhr.timeout = timeout;

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
      }

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }

  requesthWithRetry<TResponse>(
    url: string,
    options: Options = {},
    timeout = 5000
  ): Promise<TResponse> {
    const { retries = 1 } = options;

    const onError = (error: TResponse): Promise<TResponse> => {
      const retriesLeft = retries - 1;
      if (!retriesLeft) {
        throw error;
      }

      return this.requesthWithRetry<TResponse>(url, { ...options, retries: retriesLeft, timeout });
    };

    return this.request<TResponse>(url, options, timeout).catch(onError);
  }
}
