import type { TransactionStatus } from '@/codegen/api-client';
import { useFilterStore } from '@/common/hooks';
import { createFilterStore } from '@/common/utils/filterStore';
import type { TransactionFilters } from '../queries';

/* ========================================================================================= */

const store = createFilterStore<Omit<TransactionFilters, 'pageNumber' | 'pageSize'>>({
  search:   undefined,
  status:   undefined,
  fromDate: undefined,
  toDate:   undefined,
});

const setSearch   = (search?: string) => store.setFilters({ search: search?.trim() || undefined });
const setStatus   = (status?: TransactionStatus) => store.setFilters({ status });
const setFromDate = (fromDate?: string) => store.setFilters({ fromDate });
const setToDate   = (toDate?: string) => store.setFilters({ toDate });

export const useTransactionFilters = () => ({ ...useFilterStore(store), setSearch, setStatus, setFromDate, setToDate });
