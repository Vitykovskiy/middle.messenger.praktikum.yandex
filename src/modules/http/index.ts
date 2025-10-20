import { queryStringify } from '@/utils/helpers';
import {
  METHODS,
  type HTTPResponse,
  type HTTPTransportConfig,
  type Options,
  type RequestBody
} from './types';
import { parseResponse } from './helpers';
import { ContentTypes } from './constants';

type HTTPMethod = <R = unknown>(url: string, options?: Options) => Promise<HTTPResponse<R>>;

export class HTTPTransport {
  private _baseUrl: string;
  private _withCredentials: boolean;

  constructor(props: HTTPTransportConfig) {
    this._baseUrl = props.baseUrl ?? '/';
    this._withCredentials = !!props.withCredentials;
  }

  public getFileSrc(path?: string | null): string | null {
    return path ? this._baseUrl + '/resources' + path : null;
  }

  public get: HTTPMethod = (url, options = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.GET });
  };

  public post: HTTPMethod = (url, options = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.POST });
  };

  public put: HTTPMethod = (url, options = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.PUT });
  };

  public delete: HTTPMethod = (url, options = {}) => {
    return this.requesthWithRetry(url, { ...options, method: METHODS.DELETE });
  };

  public request: HTTPMethod = (url, options = {}) => {
    const { headers = {}, method, data, timeout = 5000, contentType } = options;
    const isJsonRequest = contentType === ContentTypes.JSON;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(method, isGet && !!data ? `${url}${queryStringify({ ...data })}` : url);
      xhr.withCredentials = options.withCredentials ?? this._withCredentials;
      xhr.timeout = timeout;

      if (contentType && contentType !== ContentTypes.FORM) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
      }

      xhr.onload = function () {
        const { status } = xhr;
        const isSuccess = status >= 200 && status < 300;

        if (isSuccess) {
          resolve({ code: status, data: parseResponse(xhr) });
        } else {
          reject({
            code: status,
            message: xhr.statusText || 'Request failed',
            data: parseResponse(xhr)
          });
        }
      };

      xhr.onabort = () => reject({ code: 0, message: 'Request aborted' });
      xhr.onerror = () => reject({ code: 0, message: 'Network error' });
      xhr.ontimeout = () => reject({ code: 0, message: 'Request timeout' });

      if (isGet || !data) {
        xhr.send();
      } else if (isJsonRequest) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data as RequestBody);
      }
    });
  };

  public async requesthWithRetry<R>(url: string, options: Options = {}): Promise<HTTPResponse<R>> {
    const { retries = 1 } = options;

    const uri = this._baseUrl + url;

    const onError = (error: R): Promise<HTTPResponse<R>> => {
      const retriesLeft = retries - 1;
      if (!retriesLeft) {
        throw error;
      }

      return this.requesthWithRetry<R>(uri, { ...options, retries: retriesLeft });
    };

    return this.request<R>(uri, options).catch(onError);
  }
}
