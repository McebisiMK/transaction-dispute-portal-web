import React, { Fragment, Suspense } from 'react';
import type { ReactNode } from 'react';

import { MISSED_DIALOG_ID_ERROR_MESSAGE, MISSED_DIALOG_ROOT_ID_ERROR_MESSAGE } from '../constants';
import DialogContext from '../dialogContext';
import reducer, { Types, initialState } from '../reducer';
import type { DestroyByRootIdFn, DestroyFn, HideFn, ShowFn, UpdateFn } from '../types';
import { uid } from '../utils';

/* ============================================================================================================================ */

export interface DialogProviderProps {
    children: ReactNode;
    legacy?: boolean; // Enable it if you want to use mui < 5 version
    suspense?: boolean; // Enable it if you want to wrap the dialog with the Suspense feature. @see https://beta.reactjs.org/reference/react/Suspense
    fallback?: ReactNode | null; // Custom fallback for the Suspense fallback @see https://beta.reactjs.org/reference/react/Suspense#displaying-a-fallback-while-content-is-loading
}

const DialogProvider = ({ children, legacy = false, suspense = true, fallback = null }: DialogProviderProps) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const update = React.useCallback<UpdateFn>(
        (id, props) => {
            if (!id) {
                console.error(MISSED_DIALOG_ID_ERROR_MESSAGE);
                return;
            }

            dispatch({
                type: Types.UPDATE,
                payload: {
                    id,
                    props
                }
            });
        },
        [dispatch]
    );

    const hide = React.useCallback<HideFn>(
        (id) => {
            if (!id) {
                console.error(MISSED_DIALOG_ID_ERROR_MESSAGE);
                return;
            }

            dispatch({
                type: Types.HIDE,
                payload: {
                    id
                }
            });
        },
        [dispatch]
    );

    const destroy = React.useCallback<DestroyFn>(
        (id) => {
            if (!id) {
                console.error(MISSED_DIALOG_ID_ERROR_MESSAGE);
                return;
            }

            dispatch({
                type: Types.DESTROY,
                payload: {
                    id
                }
            });
        },
        [dispatch]
    );

    const destroyByRootId = React.useCallback<DestroyByRootIdFn>(
        (rootId) => {
            if (!rootId) {
                console.error(MISSED_DIALOG_ROOT_ID_ERROR_MESSAGE);
                return;
            }

            dispatch({
                type: Types.DESTROY_BY_ROOT_ID,
                payload: {
                    rootId
                }
            });
        },
        [dispatch]
    );

    const show = React.useCallback<ShowFn>(
        (component, props, options) => {
            let id = uid(8);

            if (options && options.rootId) {
                id = `${options.rootId}.${id}`;
            }

            dispatch({
                type: Types.SHOW,
                payload: {
                    id,
                    component,
                    props,
                    options
                }
            });

            return {
                id,
                hide: () => hide(id),
                destroy: () => destroy(id),
                update: (newProps) => update(id, newProps)
            };
        },
        [dispatch, hide, destroy, update]
    );

    const renderState = () =>
        Object.keys(state).map((id) => {
            const { component: Component, props, options } = state[id];

            const handleClose = (...args: unknown[]) => {
                const reason = args[1] as string | undefined;
                if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

                if (props && props.disableClose === true) {
                    return;
                }

                if (options && options.destroyOnClose) {
                    destroy(id);
                } else {
                    hide(id);
                }

                if (props && props.onClose) {
                    props.onClose(...args);
                }
            };

            const handleExited = (...args: unknown[]) => {
                if (props?.onExited) {
                    props.onExited(...args);
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transitionOnExited = (props?.slotProps?.transition as any)?.onExited;
                if (transitionOnExited) {
                    transitionOnExited(...args);
                }

                destroy(id);
            };

            const extraProps = !legacy
                ? { slotProps: { ...props?.slotProps, transition: { ...props?.slotProps?.transition, onExited: handleExited } } }
                : { onExited: handleExited };

            return <Component {...props} key={id} onClose={handleClose} {...(options && !options.destroyOnClose && extraProps)} />;
        });

    const SuspenseWrapper = (suspense ? Suspense : Fragment) as typeof Suspense;

    return (
        <DialogContext.Provider
            value={{
                state,
                updateDialog: update,
                hideDialog: hide,
                destroyDialog: destroy,
                showDialog: show,
                destroyDialogsByRootId: destroyByRootId
            }}
        >
            {children}
            <SuspenseWrapper fallback={fallback}>{renderState()}</SuspenseWrapper>
        </DialogContext.Provider>
    );
};

/* ============================================================================================================================ */

export default DialogProvider;
