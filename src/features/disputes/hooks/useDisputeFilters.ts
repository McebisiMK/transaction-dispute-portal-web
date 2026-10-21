import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DisputeStatus } from '@/codegen/api-client';
import { DISPUTE_STATUSES } from '../constants';
import type { DisputeFilters } from '../queries';

/* ========================================================================================= */

export const PAGE_SIZE_OPTIONS = [10, 25, 50];

const DEFAULT_PAGE_SIZE = 10;
const parseStatus = (value: string | null): DisputeStatus | undefined => DISPUTE_STATUSES.find((s) => s === value);

const parsePositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const useDisputeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<DisputeFilters>(() => {
    const pageSize = parsePositiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE);
    return {
      status:     parseStatus(searchParams.get('status')),
      fromDate:   searchParams.get('fromDate') ?? undefined,
      toDate:     searchParams.get('toDate') ?? undefined,
      pageNumber: parsePositiveInt(searchParams.get('page'), 1),
      pageSize:   PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    };
  }, [searchParams]);

  const update = useCallback((patch: Record<string, string | number | undefined>, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      if (resetPage) next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const setStatus     = useCallback((status?: DisputeStatus) => update({ status }), [update]);
  const setFromDate   = useCallback((fromDate?: string) => update({ fromDate }), [update]);
  const setToDate     = useCallback((toDate?: string) => update({ toDate }), [update]);
  const setPageSize   = useCallback((pageSize: number) => update({ pageSize }), [update]);
  const setPageNumber = useCallback((pageNumber: number) => update({ page: pageNumber > 1 ? pageNumber : undefined }, false), [update]);
  const clearFilters  = useCallback(() => update({ status: undefined, fromDate: undefined, toDate: undefined }), [update]);

  const isFiltered = !!filters.status || !!filters.fromDate || !!filters.toDate;

  return { filters, isFiltered, setStatus, setFromDate, setToDate, setPageSize, setPageNumber, clearFilters };
};
