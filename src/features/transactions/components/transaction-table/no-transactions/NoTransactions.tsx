import { NoData } from '@/common/components/super-table';

/*==============================================================================================================================*/

interface NoTransactionsProps {
  isFiltered?:     boolean;
  onClearFilters?: () => void;
}

const NoTransactions = ({ isFiltered = false, onClearFilters }: NoTransactionsProps) => (
  <NoData
    icon={isFiltered ? 'search_off' : 'receipt_long'}
    message={isFiltered ? 'No transactions found' : 'No transactions yet'}
    description={
      isFiltered
        ? 'No transactions match your current filters. Try a different search, status or dates.'
        : "There are no transactions on your accounts yet. They'll appear here as soon as you use your account."
    }
    actions={isFiltered ? [{ label: 'Clear Filters', variant: 'secondary', icon: 'filter_alt_off', onClick: onClearFilters ?? (() => {}) }] : []}
  />
);

/*==============================================================================================================================*/

export default NoTransactions;
