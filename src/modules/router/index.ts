import Route from '@/modules/route';
import EventBus from '@/modules/event-bus';
import type Block from '@/modules/block';
import type { RouteConfig } from '@/modules/route/types';
import type { RouteRecord, RouterNavigationByName, RouterNavigationByPath } from './types';
import { queryStringify } from '@/utils/helpers';

export class Router {
  public history!: History;
  public routes!: Route[];

  private static __instance: Router;
  private _currentRoute!: Route | null;
  private _rootQuery!: string;
  private _pathsMap = new Map<string, Route>();
  public static EVENTS = {
    ROUTE_CHANGE: 'route:change'
  };
  private _eventBus!: EventBus;
  private _query: Record<string, string> = {};

  constructor(rootQuery: string = '#routerView') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    this._eventBus = new EventBus();

    Router.__instance = this;
  }

  public get eventBus(): EventBus {
    return this._eventBus;
  }

  public get meta(): Record<string, unknown> {
    return this._currentRoute?.meta ?? {};
  }

  public get parameters(): Record<string, string> | null {
    return this._currentRoute?.parameters ?? null;
  }

  public get query(): Record<string, string> {
    return this._query;
  }

  public get currentPath(): string {
    return window.location.pathname;
  }

  public start(): void {
    // При движении по истории через back forward go
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event?.currentTarget as Window)?.location?.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  public go(navigation: RouterNavigationByName): void;
  public go(navigation: RouterNavigationByPath): void;

  public go(navigation: RouterNavigationByName | RouterNavigationByPath): void {
    const queryPath = navigation.query ? '?' + queryStringify(navigation.query) : '';
    let pathname = '';

    if ('name' in navigation) {
      const route = this._pathsMap.get(navigation.name);

      if (route) {
        pathname = route.basePath;
        if (route.parametersKeys && navigation.params) {
          const paramsRoute = route.parametersKeys
            .map((key) => navigation.params![key] ?? ' ')
            .join('/')
            .split(' ')[0];

          pathname = pathname + '/' + paramsRoute;
        }
      }
    } else {
      pathname = navigation.path;
    }
    pathname = pathname + queryPath;

    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  // Движения по истории вызывают события popstate
  public back(): void {
    this.history.back();
  }

  public forward(): void {
    this.history.forward();
  }

  public getRoute(path: string): Route | null {
    // Если путь не найден - возвращает последний (дефолтный) роут
    const [pathName, query = ''] = path.split('?');

    this._clearQuery();
    this._setQuery(query);

    return (
      this.routes.find((route) => route.match(pathName)) ??
      this.routes[this.routes.length - 1] ??
      null
    );
  }

  public registerRoutes(routes: RouteRecord[]): void {
    routes.forEach(({ path, name, component, children, meta, paramKeys, guard }) => {
      this._use({ path, name, view: component, paramKeys, meta, guard });

      if (children) {
        this.registerRoutes(
          children.map(({ path: childPath, ...rest }) => ({ ...rest, path: path + childPath }))
        );
      }
    });
  }

  private async _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (route === this._currentRoute) {
      this._eventBus.emit(Router.EVENTS.ROUTE_CHANGE);
      return;
    }

    const access = await route?.getAccess();

    if (!route || !access) {
      this._currentRoute = null;
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;

    this._eventBus.emit(Router.EVENTS.ROUTE_CHANGE);
    route.render(this._rootQuery);
  }
  // Регистрация роутов

  private _use<T extends typeof Block>(params: RouteConfig<T>): void {
    const { path, name, meta, view, paramKeys, guard } = params;
    const route = new Route({
      path,
      name,
      view,
      paramKeys,
      meta,
      guard
    });

    if (name) this._pathsMap.set(name, route);
    this.routes.push(route);
  }

  private _clearQuery(): void {
    this._query = {};
  }

  private _setQuery(query: string): void {
    const queryParams = new URLSearchParams(query);
    for (const [key, value] of queryParams.entries()) this._query[key] = value;
  }
}

export const router = new Router();
