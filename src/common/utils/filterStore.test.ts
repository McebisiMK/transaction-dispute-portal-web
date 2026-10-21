import { describe, expect, it } from 'vitest';
import { createFilterStore, resetFilterStores } from './filterStore';

/* ========================================================================================= */

const createStore = () => createFilterStore<{ search?: string; status?: string }>({ search: undefined, status: undefined });

describe('createFilterStore', () => {
  it('starts on the first page with the default page size', () => {
    expect(createStore().getState()).toEqual({ search: undefined, status: undefined, pageNumber: 1, pageSize: 10 });
  });

  it('goes back to the first page when a filter changes', () => {
    const store = createStore();
    store.setPageNumber(3);

    store.setFilters({ status: 'Posted' });

    expect(store.getState()).toMatchObject({ status: 'Posted', pageNumber: 1 });
  });

  it('keeps the filters when changing page', () => {
    const store = createStore();
    store.setFilters({ search: 'uber' });

    store.setPageNumber(2);

    expect(store.getState()).toMatchObject({ search: 'uber', pageNumber: 2 });
  });

  it('goes back to the first page when the page size changes', () => {
    const store = createStore();
    store.setPageNumber(4);

    store.setPageSize(25);

    expect(store.getState()).toMatchObject({ pageNumber: 1, pageSize: 25 });
  });

  it('clears the filters but keeps the page size', () => {
    const store = createStore();
    store.setPageSize(50);
    store.setFilters({ search: 'uber', status: 'Posted' });
    store.setPageNumber(2);

    store.clearFilters();

    expect(store.getState()).toEqual({ search: undefined, status: undefined, pageNumber: 1, pageSize: 50 });
  });

  it('notifies subscribers until they unsubscribe', () => {
    const store = createStore();
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);

    store.setPageNumber(2);
    unsubscribe();
    store.setPageNumber(3);

    expect(calls).toBe(1);
  });

  it('resets every store', () => {
    const store = createStore();
    store.setFilters({ search: 'uber' });
    store.setPageSize(25);

    resetFilterStores();

    expect(store.getState()).toEqual({ search: undefined, status: undefined, pageNumber: 1, pageSize: 10 });
  });
});
