import type { DisputeStatus } from '@/codegen/api-client';
import { useFilterStore } from '@/common/hooks';
import { createFilterStore } from '@/common/utils/filterStore';
import type { DisputeFilters } from '../queries';

/* ========================================================================================= */

const store = createFilterStore<Omit<DisputeFilters, 'pageNumber' | 'pageSize'>>({
  status:   undefined,
  fromDate: undefined,
  toDate:   undefined,
});

const setStatus   = (status?: DisputeStatus) => store.setFilters({ status });
const setFromDate = (fromDate?: string) => store.setFilters({ fromDate });
const setToDate   = (toDate?: string) => store.setFilters({ toDate });

export const useDisputeFilters = () => ({ ...useFilterStore(store), setStatus, setFromDate, setToDate });
