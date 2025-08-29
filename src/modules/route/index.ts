import type Block from '@/modules/block';
import { isEqual } from '@/utils/helpers';
import type { RouteProps, MetaData, RouteGuard } from './types';
import { render } from '@/utils/renderDom';

export default class Route<T extends typeof Block = typeof Block, C extends Block = Block> {
  private _basePath: string;
  private _name: string | null = null;
  private _blockClass: T;
  private _props: RouteProps;
  private _block: C | null = null;
  private _parametersKeys: string[];
  private _parameters: Record<string, string> = {};
  private _meta: MetaData;
  private _guard: RouteGuard | undefined;

  constructor(
    pathname: string,
    view: T,
    props: RouteProps,
    parametersKeys: string[] = [],
    meta: MetaData = {},
    guard?: RouteGuard
  ) {
    this._basePath = pathname;
    this._name = props.name ?? null;
    this._blockClass = view;
    this._props = props;
    this._parametersKeys = parametersKeys;
    this._meta = meta;
    this._guard = guard;
  }

  public async getAccess(): Promise<boolean> {
    if (!this._guard) {
      return true;
    }
    const access = await this._guard();
    return access;
  }

  public get meta(): MetaData {
    return this._meta;
  }

  public get basePath(): string {
    return this._basePath;
  }

  public get parametersKeys(): string[] {
    return this._parametersKeys;
  }

  public get name(): string | null {
    return this._name;
  }

  public get parameters(): Record<string, string> | null {
    return this._parameters;
  }

  public navigate(pathname: string) {
    if (this.match(pathname)) {
      this._basePath = pathname;
      this.render();
    }
  }

  public leave() {
    if (!this._block) {
      return;
    }

    this.unmount();
  }

  public unmount() {
    if (this._block) {
      this._block.dispatchComponentDidUnmount();
      this._block = null;
    }
  }

  public match(pathname: string): boolean {
    if (!this._parametersKeys.length) {
      return isEqual(pathname, this._basePath);
    }

    if (this._compareBasePaths(pathname)) {
      this._setParameters(pathname);
      return true;
    }

    return false;
  }

  public render(): void {
    if (!this._block) {
      // @ts-expect-error TS2511: Cannot create an instance of an abstract class
      this._block = new this._blockClass() as C;
      render(this._props.rootQuery, this._block);
      return;
    }
  }

  private _compareBasePaths(pathname: string): boolean {
    const splittedRoutePath = this._basePath.split('/');
    const splittedPath = pathname.split('/');
    return splittedRoutePath.every((value, idx) => splittedPath[idx] === value);
  }

  private _setParameters(pathname: string): void {
    const splittedRoutePath = this._basePath.split('/');
    const splittedPath = pathname.split('/');
    this._parametersKeys.forEach((paramKey, idx) => {
      const value = splittedPath[splittedRoutePath.length + idx];
      if (value) {
        this._parameters[paramKey] = value;
      }
    });
  }
}
