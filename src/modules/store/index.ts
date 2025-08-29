import EventBus from '@/modules/event-bus';
import type { Indexed } from './types';

export class Store extends EventBus {
  public static EVENTS = {
    Updated: 'updated'
  };
  private state: Indexed = {};
  private static _instance: Store;

  constructor() {
    if (Store._instance) {
      return Store._instance;
    }
    super();

    Store._instance = this;
  }

  public getState() {
    return this.state;
  }

  public get(path: string): unknown {
    return this.state[path];
  }

  public set(path: string, value: unknown) {
    this.state[path] = value;
    this.emit(Store.EVENTS.Updated);
  }
}

export const store = new Store();
