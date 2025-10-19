import { queryStringify } from './helpers';
import { METHODS, type Options, type OptionsWithoutMethod } from './types';

type HTTPMethod = <R = unknown>(url: string, options?: Options) => Promise<R>;

export class HTTPTransport {
  get: HTTPMethod = (url: string, options: OptionsWithoutMethod = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.GET });
  };

  post: HTTPMethod = (url: string, options: OptionsWithoutMethod = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.POST });
  };

  put: HTTPMethod = (url: string, options: OptionsWithoutMethod = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.PUT });
  };

  delete: HTTPMethod = (url: string, options: OptionsWithoutMethod = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.DELETE });
  };

  request: HTTPMethod = (url: string, options: Options = {}) => {
    const { headers = {}, method, data, timeout = 5000 } = options;

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
  };

  requesthWithRetry<TResponse>(url: string, options: Options = {}): Promise<TResponse> {
    const { retries = 1 } = options;

    const onError = (error: TResponse): Promise<TResponse> => {
      const retriesLeft = retries - 1;
      if (!retriesLeft) {
        throw error;
      }

      return this.requesthWithRetry<TResponse>(url, { ...options, retries: retriesLeft });
    };

    return this.request<TResponse>(url, options).catch(onError);
  }
}
