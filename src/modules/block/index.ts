import { v4 as makeUUID } from 'uuid';
import EventBus from '@/modules/event-bus';
import { cloneDeep, isEqual } from '@/utils/helpers';
import { Templator } from '@/utils/templator';
import type { IBlockChildren, IBlockMeta, IBlockProps } from './types';
import { isBlock, isBlockArray, isHTMLInput } from './helpers';

abstract class Block {
  public props: IBlockProps;
  public children: IBlockChildren;
  public id: string | null = null;
  public static EVENTS = {
    INIT: 'init',
    FLOW_MOUNT: 'flow:component-did-mount',
    FLOW_UPDATE: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
    FLOW_UNMOUNT: 'flow:component-did-unmount'
  };

  private _element: HTMLElement | null = null;
  private _meta: IBlockMeta;
  private _eventBus: () => EventBus;

  constructor(props: IBlockProps = {}) {
    const { tagName = 'div' } = props;

    const eventBus = new EventBus();
    this.props = this._makePropsProxy(props);
    this._meta = {
      tagName
    };
    this.children = this._getChildren(props);
    this._eventBus = () => eventBus;

    this._generateId();
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  get element(): HTMLElement {
    if (!this._element) {
      throw new Error('Element not found');
    }
    return this._element;
  }

  get eventBus(): EventBus {
    return this._eventBus();
  }

  public init(): void {
    this._createResources();
    this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  public onMount(): void {}

  public onUpdate(_oldProps: IBlockProps, _newProps: IBlockProps): boolean {
    return true;
  }

  public abstract render(): DocumentFragment;

  public compile(template: string, props: IBlockProps): DocumentFragment {
    const propsAndStubs = { ...props };
    this.children = this._getChildren(props);

    Object.entries(this.children).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        propsAndStubs[key] = value
          .map((child) => `<div${child.id ? ` data-id="${child.id}"` : ''}></div>`)
          .join('');
      } else {
        propsAndStubs[key] = `<div${value.id ? ` data-id="${value.id}"` : ''}></div>`;
      }
    });

    const fragment = this._createDocumentElement('template');

    fragment.innerHTML = Templator.compile(template, propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const handleChild = (child: Block) => {
        if (!child.id) return;
        const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);

        if (!stub) return;
        stub.replaceWith(child.getContent());
      };

      if (Array.isArray(child)) {
        child.forEach((item) => handleChild(item));
      } else {
        handleChild(child);
      }
    });
    return fragment.content;
  }

  public dispatchComponentDidMount(): void {
    this._eventBus().emit(Block.EVENTS.FLOW_MOUNT);
  }

  public dispatchComponentDidUnmount(): void {
    this._eventBus().emit(Block.EVENTS.FLOW_UNMOUNT);
  }

  public setProps(nextProps: IBlockProps): void {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  }

  public getContent(): HTMLElement {
    return this.element;
  }

  public show(): void {
    this.getContent().style.display = '';
  }

  public hide(): void {
    this.getContent().style.display = 'none';
  }

  public onUnmount(): void {}

  private _getChildren(props: IBlockProps): IBlockChildren {
    const children: IBlockChildren = {};

    Object.entries(props).forEach(([key, value]) => {
      if (isBlock(value) || isBlockArray(value)) {
        children[key] = value;
      }
    });
    return children;
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_MOUNT, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_UPDATE, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_UNMOUNT, this._componentDidUnmount.bind(this));
  }

  private _addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this.element.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this.element.removeEventListener(eventName, events[eventName]);
    });
  }

  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private _componentDidMount(): void {
    this.onMount();

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((item) => item.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  private _componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps): void {
    if (!isEqual(oldProps, newProps)) {
      this._render();
      this.onUpdate(oldProps, newProps);
    }
  }

  private _render(): void {
    const block = this.render();

    this._removeEvents();

    this.element.innerHTML = '';

    this.element.appendChild(block);

    this._addEvents();

    if (this.id) {
      this.element.setAttribute('data-block-id', this.id);
    }

    this._applyWrapperProperties();
  }

  private _componentDidUnmount(): void {
    this.onUnmount();

    this.element.remove();
  }

  private _applyWrapperProperties(): void {
    if (!this.props.wrapperProps) {
      return;
    }

    this.element.className = ''; // Очищаем предыдущие классы перед добавлением новых

    Object.entries(this.props.wrapperProps).forEach(([key, value]) => {
      if (key === 'classes') {
        this.element.classList.add(...(value as string[]));
      } else if (key === 'styles') {
        this.element.style = (value as string[]).join(';');
      } else if (key === 'value' && isHTMLInput(this.element)) {
        this.element.value = (value as string) ?? '';
      } else {
        this.element.setAttribute(key, String(value ?? ''));
      }
    });
  }

  private _makePropsProxy(props: IBlockProps): IBlockProps {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const proxyProps = new Proxy(props, {
      get(target: IBlockProps, property: string) {
        const value = target[property];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: IBlockProps, property: string, newValue: IBlockProps[keyof IBlockProps]) {
        const originalTarget = cloneDeep<IBlockProps>(target);
        target[property] = newValue;
        self._eventBus().emit(Block.EVENTS.FLOW_UPDATE, originalTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('DeleteProperty: Access denied');
      }
    });

    return proxyProps;
  }

  private _generateId(): void {
    this.id = makeUUID();
  }

  private _createDocumentElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T
  ): HTMLElementTagNameMap[T] {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }
}

export default Block;
