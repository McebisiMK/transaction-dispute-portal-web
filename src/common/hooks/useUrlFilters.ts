import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/common/constants/paging';
import { parsePositiveInt } from '@/common/utils/searchParams';

/* =========================================================== */

export type UrlFilterPatch = Record<string, string | number | undefined>;

export interface UrlFilterUpdateOptions {
  resetPage?: boolean;
  replace?:   boolean;
}

const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const paging = useMemo(() => {
    const pageSize = parsePositiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE);
    return {
      pageNumber: parsePositiveInt(searchParams.get('page'), 1),
      pageSize:   PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    };
  }, [searchParams]);

  const update = useCallback((patch: UrlFilterPatch, { resetPage = true, replace = false }: UrlFilterUpdateOptions = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      if (resetPage) next.delete('page');
      return next;
    }, { replace });
  }, [setSearchParams]);

  const setPageSize   = useCallback((pageSize: number) => update({ pageSize }), [update]);
  const setPageNumber = useCallback((pageNumber: number) => update({ page: pageNumber > 1 ? pageNumber : undefined }, { resetPage: false }), [update]);

  return { searchParams, paging, update, setPageSize, setPageNumber };
};

/* =========================================================== */

export default useUrlFilters;
