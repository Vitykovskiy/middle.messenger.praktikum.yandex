import Route from '@/modules/route';
import EventBus from '@/modules/event-bus';
import type Block from '@/modules/block';
import type { MetaData, RouteGuard } from '@/modules/route/types';
import type { IRouteRaw, IRouterNavigationByName, IRouterNavigationByPath } from './types';

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

  public get meta() {
    if (!this._currentRoute) {
      return null;
    }

    return this._currentRoute.meta;
  }

  public get parameters() {
    if (!this._currentRoute) {
      return null;
    }

    return this._currentRoute.parameters;
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

  public go(navigation: IRouterNavigationByName): void;

  public go(navigation: IRouterNavigationByPath): void;

  public go(navigation: IRouterNavigationByName | IRouterNavigationByPath): void {
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

  public getRoute(pathname: string): Route | null {
    // Если путь не найден - возвращает последний (дефолтный) роут
    return (
      this.routes.find((route) => route.match(pathname)) ??
      this.routes[this.routes.length - 1] ??
      null
    );
  }

  public registerRoutes(routes: IRouteRaw[]): void {
    routes.forEach(({ path, name, component, children, meta, parameters, guard }) => {
      this._use(path, name, component, parameters, meta, guard);

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

    if (!route) {
      return;
    }

    this._eventBus.emit(Router.EVENTS.ROUTE_CHANGE);
    route.render();
  }
  // Регистрация роутов

  private _use(
    pathname: string,
    name: string,
    block: typeof Block,
    parameters?: string[],
    meta?: MetaData,
    _use?: RouteGuard
  ): void {
    const route = new Route(
      pathname,
      block,
      { rootQuery: this._rootQuery, name },
      parameters,
      meta,
      _use
    );
    this._pathsMap.set(name, route);
    this.routes.push(route);
  }
}

export const router = new Router();
