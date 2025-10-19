import { v4 as makeUUID } from 'uuid';
import EventBus from '@/modules/event-bus';
import { copy, compareObjects } from '@/utils/helpers';
import type { IBlockChildren, IBlockMeta, IBlockWrapperProps, IBlockProps } from './types';
import { Templator } from '@/utils/templator';

abstract class Block {
  public props: IBlockProps;
  public children: IBlockChildren;
  public id: string | null = null;
  public static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  };

  private _element: HTMLElement | null = null;
  private _meta: IBlockMeta;
  private _eventBus: () => EventBus;

  constructor(
    tagName: keyof HTMLElementTagNameMap = 'div',
    propsAndChildren: IBlockProps = {},
    options: IBlockWrapperProps = {}
  ) {
    const eventBus = new EventBus();
    const { children, props } = this._getChildren(propsAndChildren);

    this._meta = {
      tagName,
      props,
      options
    };
    this.props = this._makePropsProxy(props);
    this.children = children;
    this._eventBus = () => eventBus;

    this._generateId();
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  get element(): HTMLElement {
    if (!this._element) {
      throw new Error('Элемент отсутствует');
    }
    return this._element;
  }

  public init(): void {
    this._createResources();
    this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  public componentDidMount(_oldProps?: IBlockProps): void {}

  public componentDidUpdate(_oldProps: IBlockProps, _newProps: IBlockProps): boolean {
    return true;
  }

  public abstract render(): DocumentFragment;

  public compile(template: string, props: IBlockProps): DocumentFragment {
    const propsAndStubs = { ...props };

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
    this._eventBus().emit(Block.EVENTS.FLOW_CDM);
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
    this.getContent().style.display = 'block';
  }

  public hide(): void {
    this.getContent().style.display = 'none';
  }

  private _getChildren(propsAndChildren: IBlockProps): {
    props: IBlockProps;
    children: IBlockChildren;
  } {
    const children: IBlockChildren = {};
    const props: IBlockProps = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      const isChild = value instanceof Block;
      const isChildren = Array.isArray(value) && value.length && value[0] instanceof Block;

      if (isChild || isChildren) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    return { props, children };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
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
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((item) => item.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  private _componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps): void {
    // В случае отсутствия изменений в свойствах перерендера не будет
    if (!compareObjects(oldProps, newProps)) {
      this._render();
      this.componentDidUpdate(oldProps, newProps);
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

    Object.entries(this._meta.options).forEach(([key, value]) => {
      if (key === 'classes') {
        this.element.classList.add(...(value as string[]));
      } else if (key === 'styles') {
        this.element.style = (value as string[]).join(';');
      } else {
        this.element.setAttribute(key, String(value ?? ''));
      }
    });
  }

  private _makePropsProxy(props: IBlockProps): IBlockProps {
    // Ещё один способ передачи this, но он больше не применяется с приходом ES6+
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const proxyProps = new Proxy(props, {
      get(target: IBlockProps, property: string) {
        const value = target[property];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: IBlockProps, property: string, newValue: IBlockProps[keyof IBlockProps]) {
        const originalTarget = copy<IBlockProps>(target);
        target[property] = newValue;
        self._eventBus().emit(Block.EVENTS.FLOW_CDU, originalTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
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
