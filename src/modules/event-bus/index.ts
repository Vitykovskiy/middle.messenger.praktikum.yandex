/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export default class EventBus {
  listners: Record<string, Function[]>;

  constructor() {
    this.listners = {};
  }

  on(event: string, callback: Function): void {
    if (!this.listners[event]) {
      this.listners[event] = [];
    }

    this.listners[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listners[event]) {
      throw new Error(`Event not found: ${event}`);
    }

    this.listners[event] = this.listners[event].filter((listener) => listener !== callback);
  }

  emit<T>(event: string, ...args: T[]): void {
    if (!this.listners[event]) {
      return;
    }

    this.listners[event].forEach((listner) => listner(...args));
  }
}
