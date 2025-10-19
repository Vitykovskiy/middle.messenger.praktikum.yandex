export type Options = {
  method?: METHODS;
  data?: Record<string, unknown>;
  headers?: unknown;
  timeout?: number;
  retries?: number;
};

export type OptionsWithoutMethod = Omit<Options, 'method'>;

export const enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
