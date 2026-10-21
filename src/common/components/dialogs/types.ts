import type { ComponentType } from 'react';

/* ======================================================================= */

export type DialogComponent<P> = ComponentType<P>;
export type DialogComponentProps<P> = Omit<P, 'open'>;

export interface Props {
  open?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Options {
  destroyOnClose?: boolean;
  rootId?: string;
}

export interface State {
  [id: string]: StateElement;
}

export interface StateElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  props?: Props;
  options?: Options;
}

export type ActionMap<M extends object> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type UpdateFn = <P extends Props>(id: string, props: Partial<DialogComponentProps<P>>) => void;
export type HideFn = (id: string) => void;
export type DestroyFn = (id: string) => void;
export type DestroyByRootIdFn = (rootId: string) => void;
export type ShowFn = <P extends Props>(component: ComponentType<P>, props?: DialogComponentProps<P>, options?: Options) => ShowFnOutput<P>;

export interface ShowFnOutput<P> {
  id: string;
  hide: () => void;
  destroy: () => void;
  update: (newProps: Partial<DialogComponentProps<P>>) => void;
}
