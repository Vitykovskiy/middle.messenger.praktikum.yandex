import type Block from '@/modules/block';
import type { MetaData, RouteGuard } from '@/modules/route/types';

export interface IRouteRaw {
  name: string;
  path: string;
  component: typeof Block;
  children?: IRouteRaw[];
  parameters?: string[];
  meta?: MetaData;
  guard?: RouteGuard;
}

export interface IRouterNavigationByName extends IRouterNavigation {
  name: string;
}

export interface IRouterNavigationByPath extends IRouterNavigation {
  path: string;
}

export interface IRouterNavigation {
  params?: Record<string, string | number>;
  query?: Record<string, unknown>;
}
