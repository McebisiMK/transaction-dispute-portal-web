import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiException } from '@/codegen/api-client';
import { queryClient } from './queryClient';
import { snackbarError } from './snackbarRef';

vi.mock('./snackbarRef', () => ({ snackbarError: vi.fn() }));

/* ========================================================================================= */

const notFound = () => new ApiException('Not Found', 404, '', {}, { detail: 'Dispute not found' });

describe('queryClient', () => {
  afterEach(() => {
    queryClient.clear();
    vi.mocked(snackbarError).mockClear();
  });

  it('leaves a failed first load to the page', async () => {
    await queryClient.prefetchQuery({ queryKey: ['first-load'], queryFn: () => Promise.reject(notFound()) });

    expect(snackbarError).not.toHaveBeenCalled();
  });

  it('shows a snackbar when a refetch fails while data is on screen', async () => {
    queryClient.setQueryData(['refetch'], { id: 1 });

    await queryClient.prefetchQuery({ queryKey: ['refetch'], queryFn: () => Promise.reject(notFound()), staleTime: 0 });

    expect(snackbarError).toHaveBeenCalledWith('Dispute not found');
  });

  it('shows a snackbar when a mutation fails', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, { mutationFn: () => Promise.reject(notFound()) });

    await mutation.execute(undefined).catch(() => {});

    expect(snackbarError).toHaveBeenCalledWith('Dispute not found');
  });

  it('leaves mutation errors to a form that shows them inline', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, { mutationFn: () => Promise.reject(notFound()), meta: { inlineErrors: true } });

    await mutation.execute(undefined).catch(() => {});

    expect(snackbarError).not.toHaveBeenCalled();
  });
});
