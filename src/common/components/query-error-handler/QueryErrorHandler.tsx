import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { setEnqueueSnackbar } from "@/lib/snackbarRef";

/* ======================================================================== */

const QueryErrorHandler = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setEnqueueSnackbar(enqueueSnackbar);
  }, [enqueueSnackbar]);

  return null;
};

/* ======================================================================== */

export default QueryErrorHandler;
