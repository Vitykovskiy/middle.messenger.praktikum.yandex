import type { ContentTypes } from './constants';

export type HTTPTransportConfig = {
  baseUrl?: string;
  withCredentials?: boolean;
};

export type Options = {
  method?: METHODS;
  data?: unknown;
  contentType?: ContentTypes;
  headers?: unknown;
  timeout?: number;
  retries?: number;
  withCredentials?: boolean;
};

export type OptionsWithoutMethod = Omit<Options, 'method'>;

export const enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export type HTTPResponse<T> = {
  code: number;
  data: T;
};

export type RequestBody = Document | XMLHttpRequestBodyInit | null | undefined;
