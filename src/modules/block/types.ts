import type Block from '.';

export interface IBlockProps extends Record<string, unknown> {
  events?: Record<string, (event: Event) => void>;
  key?: string;
}

export type IBlockChildren = Record<string, Block | Block[]>;

export interface IBlockWrapperProps extends Record<string, unknown> {
  classes?: string[];
  styles?: string[];
}

export interface IBlockMeta {
  tagName: keyof HTMLElementTagNameMap;
  props: IBlockProps;
  options: IBlockWrapperProps;
}
