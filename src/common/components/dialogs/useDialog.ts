import { useCallback, useContext, useEffect, useRef } from 'react';

import DialogContext from './dialogContext';
import type { ShowFn } from './types';
import { uid } from './utils';

/* ==================================================================================================== */

export interface UseDialogOptions {
  disableAutoDestroy?: boolean;
}

const defaultOptions: UseDialogOptions = {
  disableAutoDestroy: false
};

export default function useDialog(options: UseDialogOptions = defaultOptions) {
  const { disableAutoDestroy } = { ...defaultOptions, ...options };
  const { showDialog, destroyDialogsByRootId: destroy, ...otherContextProps } = useContext(DialogContext);
  const id = useRef<string>(uid(6));

  useEffect(
    () => () => {
      if (!disableAutoDestroy) {
        destroy(id.current);
      }
    },
    [disableAutoDestroy, destroy]
  );

  return {
    showDialog: useCallback<ShowFn>((component, props, options) => showDialog(component, props, { rootId: id.current, ...options }), [showDialog]),
    ...otherContextProps
  };
}
