import { useSyncExternalStore } from 'react';
import type { FilterStore } from '@/common/utils/filterStore';

/* =========================================================== */

const useFilterStore = <F extends object>(store: FilterStore<F>) => {
  const filters = useSyncExternalStore(store.subscribe, store.getState);

  const isFiltered = (Object.keys(store.defaults) as (keyof F)[]).some((key) => filters[key] !== store.defaults[key]);

  return {
    filters,
    isFiltered,
    setPageNumber: store.setPageNumber,
    setPageSize:   store.setPageSize,
    clearFilters:  store.clearFilters,
  };
};

/* =========================================================== */

export default useFilterStore;
