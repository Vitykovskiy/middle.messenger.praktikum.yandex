export type RouteMeta = Record<string, unknown>; // Произвольные метаданные роута

export type RouteGuard = () => Promise<boolean> | boolean;

export interface RouteConfig<T> {
  view: T;
  path: string;
  name?: string;
  paramKeys?: string[];
  meta?: RouteMeta;
  guard?: RouteGuard;
}
