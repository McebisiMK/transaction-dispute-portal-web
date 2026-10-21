import { DEFAULT_PAGE_SIZE } from '@/common/constants/paging';

/* ========================================================================================= */

export interface Paging {
  pageNumber: number;
  pageSize:   number;
}

export type FilterState<F extends object> = F & Paging;

export interface FilterStore<F extends object> {
  defaults:      F;
  getState:      () => FilterState<F>;
  subscribe:     (listener: () => void) => () => void;
  setFilters:    (patch: Partial<F>) => void;
  setPageNumber: (pageNumber: number) => void;
  setPageSize:   (pageSize: number) => void;
  clearFilters:  () => void;
  reset:         () => void;
}

const stores = new Set<FilterStore<object>>();

export const createFilterStore = <F extends object>(defaults: F): FilterStore<F> => {
  const initial: FilterState<F> = { ...defaults, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE };
  const listeners = new Set<() => void>();
  let state = initial;

  const setState = (next: FilterState<F>) => {
    state = next;
    listeners.forEach((listener) => listener());
  };

  const store: FilterStore<F> = {
    defaults,
    getState:      () => state,
    subscribe:     (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setFilters:    (patch) => setState({ ...state, ...patch, pageNumber: 1 }),
    setPageNumber: (pageNumber) => setState({ ...state, pageNumber }),
    setPageSize:   (pageSize) => setState({ ...state, pageSize, pageNumber: 1 }),
    clearFilters:  () => setState({ ...initial, pageSize: state.pageSize }),
    reset:         () => setState(initial),
  };

  stores.add(store as FilterStore<object>);
  return store;
};

export const resetFilterStores = () => stores.forEach((store) => store.reset());
