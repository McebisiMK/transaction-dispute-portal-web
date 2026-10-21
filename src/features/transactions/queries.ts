import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/common/auth';
import type { TransactionStatus } from '@/codegen/api-client';

/* ========================================================================================= */

export interface TransactionFilters {
  search?:    string;
  status?:    TransactionStatus;
  fromDate?:  string;
  toDate?:    string;
  pageNumber: number;
  pageSize:   number;
}

export const transactionKeys = {
  all:     ['transactions'] as const,
  lists:   () => [...transactionKeys.all, 'list'] as const,
  list:    (filters: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail:  (id: string) => [...transactionKeys.details(), id] as const,
};

/* ========================================================================================= */

export const useTransactions = (filters: TransactionFilters) => {
  const { transactions } = useApiClient();

  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: ({ signal }) =>
      transactions.getTransactions(filters.fromDate, filters.toDate, filters.search, filters.status, undefined, filters.pageNumber, filters.pageSize, signal),
    placeholderData: keepPreviousData,
  });
};
