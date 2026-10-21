import { useCallback, useMemo } from 'react';
import type { DisputeStatus } from '@/codegen/api-client';
import { useUrlFilters } from '@/common/hooks';
import { parseOption } from '@/common/utils/searchParams';
import { DISPUTE_STATUSES } from '../constants';
import type { DisputeFilters } from '../queries';

/* ========================================================================================= */

export const useDisputeFilters = () => {
  const { searchParams, paging, update, setPageSize, setPageNumber } = useUrlFilters();

  const filters = useMemo<DisputeFilters>(() => ({
    status:   parseOption(searchParams.get('status'), DISPUTE_STATUSES),
    fromDate: searchParams.get('fromDate') ?? undefined,
    toDate:   searchParams.get('toDate') ?? undefined,
    ...paging,
  }), [searchParams, paging]);

  const setStatus    = useCallback((status?: DisputeStatus) => update({ status }), [update]);
  const setFromDate  = useCallback((fromDate?: string) => update({ fromDate }), [update]);
  const setToDate    = useCallback((toDate?: string) => update({ toDate }), [update]);
  const clearFilters = useCallback(() => update({ status: undefined, fromDate: undefined, toDate: undefined }), [update]);

  const isFiltered = !!filters.status || !!filters.fromDate || !!filters.toDate;

  return { filters, isFiltered, setStatus, setFromDate, setToDate, setPageSize, setPageNumber, clearFilters };
};
