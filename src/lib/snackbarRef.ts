import type { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

/* ======================================================================== */

type EnqueueSnackbar = (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;

let _enqueue: EnqueueSnackbar = () => "" as SnackbarKey;

export const setEnqueueSnackbar = (fn: EnqueueSnackbar) => {
  _enqueue = fn;
};

export const snackbarError = (message: string) =>
  _enqueue(message, { variant: "error" });
