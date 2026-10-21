import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { NoData, SuperTable, type SuperTableColumn } from '@/common/components/super-table';
import { PAGE_SIZE_OPTIONS } from '@/common/constants/paging';
import { getErrorMessage } from '@/lib/apiErrors';
import { useDisputeQueue } from '../../queries';
import { useQueueFilters } from '../../hooks/useQueueFilters';
import { QueueTableRow, QueueTableToolbar } from '../../components/queue-table';

/* ========================================================================================= */

const COLUMNS: SuperTableColumn[] = [
  { id: 'reference', label: 'Reference', width: '13%' },
  { id: 'customer', label: 'Customer', width: '13%' },
  { id: 'transaction', label: 'Transaction', width: '17%' },
  { id: 'amount', label: 'Amount', align: 'right', width: '10%' },
  { id: 'reason', label: 'Reason', width: '16%', headStyles: { pl: 5 } },
  { id: 'status', label: 'Status', align: 'center', width: '11%' },
  { id: 'submittedAt', label: 'Submitted', width: '9%' },
  { id: 'lastUpdatedAt', label: 'Last updated', width: '9%' },
];

const DisputeQueuePage = () => {
  const { filters, isFiltered, setStatus, setPageNumber, setPageSize, clearFilters } = useQueueFilters();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useDisputeQueue(filters);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet>
        <title>Dispute queue | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs heading="Dispute queue" links={[{ name: 'Agent' }, { name: 'Dispute queue' }]} />
      </Box>

      <QueueTableToolbar status={filters.status} onStatusChange={setStatus} />

      {isError && !data && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!(isError && !data) && (
        <Box sx={{ mb: -2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {isFetching && isPlaceholderData && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }} />}

          <SuperTable
            hasActions
            hideSelection
            loading={isPending}
            columns={COLUMNS}
            count={data?.totalCount ?? 0}
            page={filters.pageNumber - 1}
            rowsPerPage={filters.pageSize}
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(page) => setPageNumber(page + 1)}
            onRowsPerPageChange={setPageSize}
            noData={
              <NoData
                icon={isFiltered ? 'search_off' : 'task_alt'}
                message={isFiltered ? 'No disputes with this status' : 'The queue is empty'}
                description={isFiltered ? 'Try another status.' : 'There are no open disputes waiting for review.'}
                actions={isFiltered ? [{ label: 'Show open disputes', variant: 'secondary', icon: 'filter_alt_off', onClick: clearFilters }] : []}
              />
            }
          >
            {data?.items.map((dispute) => (
              <QueueTableRow key={dispute.id} dispute={dispute} />
            ))}
          </SuperTable>
        </Box>
      )}
    </Box>
  );
};

/* ========================================================================================= */

export default DisputeQueuePage;
