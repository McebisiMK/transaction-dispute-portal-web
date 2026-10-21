import { createContext } from 'react';

import { initialState } from './reducer';
import type { DestroyByRootIdFn, DestroyFn, HideFn, ShowFn, State, UpdateFn } from './types';

/* ======================================================================================= */

export interface DialogContextState {
    state: State;
    updateDialog: UpdateFn;
    hideDialog: HideFn;
    destroyDialog: DestroyFn;
    destroyDialogsByRootId: DestroyByRootIdFn;
    showDialog: ShowFn;
}

export const initialContextState = {
    state: initialState,
    hideDialog: () => { },
    showDialog: () => ({
        id: 'id',
        hide: () => { },
        destroy: () => { },
        update: () => { }
    }),
    destroyDialog: () => { },
    updateDialog: () => { },
    destroyDialogsByRootId: () => { }
};

const DialogContext = createContext<DialogContextState>(initialContextState);

/* ======================================================================================= */

export default DialogContext;
