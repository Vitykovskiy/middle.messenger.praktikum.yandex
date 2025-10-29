import type Block from '@/modules/block';
import type { RouteMeta, RouteGuard } from '@/modules/route/types';

export interface RouteRecord<T extends typeof Block = typeof Block> {
  name: string;
  path: string;
  component: T;
  children?: RouteRecord<T>[];
  paramKeys?: string[];
  meta?: RouteMeta;
  guard?: RouteGuard;
}

export interface RouterNavigation {
  params?: Record<string, string | number>;
  query?: Record<string, unknown>;
}

export interface RouterNavigationByName extends RouterNavigation {
  name: string;
}

export interface RouterNavigationByPath extends RouterNavigation {
  path: string;
}

export type IRouteRaw = RouteRecord;
export type IRouterNavigation = RouterNavigation;
export type IRouterNavigationByName = RouterNavigationByName;
export type IRouterNavigationByPath = RouterNavigationByPath;
