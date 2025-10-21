import type Block from '.';

export type IBlockChildren = Record<string, Block | Block[]>;

export interface IBlockProps extends Record<string, Block | Block[] | unknown> {
  tagName?: keyof HTMLElementTagNameMap;
  events?: Record<string, (event: Event) => void>;
  key?: string;
  wrapperProps?: IBlockWrapperProps;
}

export interface IBlockMeta {
  tagName: keyof HTMLElementTagNameMap;
}

export interface IBlockWrapperProps extends Record<string, unknown> {
  classes?: string[];
  styles?: string[];
}
