import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { getErrorMessage, isApiException } from './apiErrors';
import { snackbarError } from './snackbarRef';

/* =========================================================== */

// 4xx responses won't change on retry; only retry network and server errors.
const shouldRetry = (failureCount: number, error: unknown) =>
  failureCount < 2 && !(isApiException(error) && error.status >= 400 && error.status < 500);

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) snackbarError(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => snackbarError(getErrorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
