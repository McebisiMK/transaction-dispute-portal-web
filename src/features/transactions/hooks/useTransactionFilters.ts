import { useCallback, useMemo } from 'react';
import type { TransactionStatus } from '@/codegen/api-client';
import { useUrlFilters } from '@/common/hooks';
import { parseOption } from '@/common/utils/searchParams';
import { TRANSACTION_STATUSES } from '../constants';
import type { TransactionFilters } from '../queries';

/* ========================================================================================= */

export const useTransactionFilters = () => {
  const { searchParams, paging, update, setPageSize, setPageNumber } = useUrlFilters();

  const filters = useMemo<TransactionFilters>(() => ({
    search:   searchParams.get('search')?.trim() || undefined,
    status:   parseOption(searchParams.get('status'), TRANSACTION_STATUSES),
    fromDate: searchParams.get('fromDate') ?? undefined,
    toDate:   searchParams.get('toDate') ?? undefined,
    ...paging,
  }), [searchParams, paging]);

  const setSearch    = useCallback((search?: string) => update({ search }, { replace: true }), [update]);
  const setStatus    = useCallback((status?: TransactionStatus) => update({ status }), [update]);
  const setFromDate  = useCallback((fromDate?: string) => update({ fromDate }), [update]);
  const setToDate    = useCallback((toDate?: string) => update({ toDate }), [update]);
  const clearFilters = useCallback(() => update({ search: undefined, status: undefined, fromDate: undefined, toDate: undefined }), [update]);

  const isFiltered = !!filters.search || !!filters.status || !!filters.fromDate || !!filters.toDate;

  return { filters, isFiltered, setSearch, setStatus, setFromDate, setToDate, setPageSize, setPageNumber, clearFilters };
};
