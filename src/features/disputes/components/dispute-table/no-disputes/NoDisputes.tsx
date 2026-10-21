import { NoData } from '@/common/components/super-table';

/*==============================================================================================================================*/

interface NoDisputesProps {
  isFiltered?:     boolean;
  onClearFilters?: () => void;
}

const NoDisputes = ({ isFiltered = false, onClearFilters }: NoDisputesProps) => {
  return (
    <NoData
      icon={isFiltered ? 'search_off' : 'gavel'}
      message={isFiltered ? 'No disputes found' : 'No disputes yet'}
      description={
        isFiltered
          ? 'No disputes match your current filters. Try adjusting the status or dates.'
          : "You haven't disputed any transactions. Disputes you raise will appear here with their full history."
      }
      actions={isFiltered ? [{ label: 'Clear Filters', variant: 'secondary', icon: 'filter_alt_off', onClick: onClearFilters ?? (() => {}) }] : []}
    />
  );
};

/*==============================================================================================================================*/

export default NoDisputes;
