import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useDebouncedValue from './useDebouncedValue';

/* ========================================================================================= */

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('only updates after the value has stopped changing for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), { initialProps: { value: 'u' } });

    rerender({ value: 'ub' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'uber' });
    act(() => vi.advanceTimersByTime(399));

    expect(result.current).toBe('u');

    act(() => vi.advanceTimersByTime(1));

    expect(result.current).toBe('uber');
  });
});
