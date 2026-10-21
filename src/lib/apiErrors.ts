import { ApiException, type ProblemDetails } from '@/codegen/api-client';

/* =========================================================== */

export const isApiException = (error: unknown): error is ApiException =>
  typeof error === 'object' && error !== null && ApiException.isApiException(error);

const getProblemDetails = (error: unknown): ProblemDetails | undefined =>
  isApiException(error) && typeof error.result === 'object' && error.result !== null ? (error.result as ProblemDetails) : undefined;

// Turns an ApiException (ProblemDetails body) or network error into a message for the user.
export const getErrorMessage = (error: unknown): string => {
  const problem = getProblemDetails(error);
  if (problem) return problem.detail ?? problem.title ?? 'An error occurred';
  if (isApiException(error)) return `${error.message} (${error.status})`;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};
