import type { DisputeStatus } from '@/codegen/api-client';
import { useFilterStore } from '@/common/hooks';
import { createFilterStore } from '@/common/utils/filterStore';
import type { QueueFilters } from '../queries';

/* ========================================================================================= */

const store = createFilterStore<Omit<QueueFilters, 'pageNumber' | 'pageSize'>>({
  status: undefined,
});

const setStatus = (status?: DisputeStatus) => store.setFilters({ status });

export const useQueueFilters = () => ({ ...useFilterStore(store), setStatus });
