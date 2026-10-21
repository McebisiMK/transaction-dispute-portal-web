import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import useUrlFilters from './useUrlFilters';

/* ========================================================================================= */

const renderUrlFilters = (route: string) =>
  renderHook(() => ({ filters: useUrlFilters(), location: useLocation() }), {
    wrapper: ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>,
  });

describe('useUrlFilters', () => {
  it('reads paging from the URL', () => {
    const { result } = renderUrlFilters('/?page=3&pageSize=25');

    expect(result.current.filters.paging).toEqual({ pageNumber: 3, pageSize: 25 });
  });

  it('falls back to the defaults for invalid paging values', () => {
    const { result } = renderUrlFilters('/?page=-1&pageSize=7');

    expect(result.current.filters.paging).toEqual({ pageNumber: 1, pageSize: 10 });
  });

  it('sets and removes filters and resets the page', () => {
    const { result } = renderUrlFilters('/?page=4&status=Approved');

    act(() => result.current.filters.update({ status: undefined, search: 'uber' }));

    expect(result.current.location.search).toBe('?search=uber');
  });

  it('keeps the other filters when changing page', () => {
    const { result } = renderUrlFilters('/?status=Approved');

    act(() => result.current.filters.setPageNumber(2));

    expect(result.current.location.search).toBe('?status=Approved&page=2');
  });

  it('drops the page parameter when going back to the first page', () => {
    const { result } = renderUrlFilters('/?status=Approved&page=2');

    act(() => result.current.filters.setPageNumber(1));

    expect(result.current.location.search).toBe('?status=Approved');
  });
});
