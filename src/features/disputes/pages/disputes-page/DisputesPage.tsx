import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { SuperTable, type SuperTableColumn } from '@/common/components/super-table';
import { getErrorMessage } from '@/lib/apiErrors';
import { useDisputes } from '../../queries';
import { PAGE_SIZE_OPTIONS, useDisputeFilters } from '../../hooks/useDisputeFilters';
import { DisputeTableRow, DisputeTableSkeleton, DisputeTableToolbar, NoDisputes } from '../../components/dispute-table';

/* ========================================================================================= */

const COLUMNS: SuperTableColumn[] = [
  { id: 'transaction', label: 'Transaction' },
  { id: 'reference', label: 'Reference' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: 'reason', label: 'Reason' },
  { id: 'status', label: 'Status' },
  { id: 'submittedAt', label: 'Submitted' },
  { id: 'lastUpdatedAt', label: 'Last updated' },
];

const DisputesPage = () => {
  const { filters, isFiltered, setStatus, setFromDate, setToDate, setPageNumber, setPageSize, clearFilters } = useDisputeFilters();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useDisputes(filters);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet>
        <title>My Disputes | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs heading="My Disputes" links={[{ name: 'Disputes' }, { name: 'History' }]} />
      </Box>

      <DisputeTableToolbar
        status={filters.status}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        isFiltered={isFiltered}
        onStatusChange={setStatus}
        onFromChange={setFromDate}
        onToChange={setToDate}
        onClear={clearFilters}
      />

      {isPending && <DisputeTableSkeleton />}
      {isError && !data && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!!data && (
        <Box sx={{ mb: -2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {isFetching && isPlaceholderData && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }} />}

          <SuperTable
            hasActions
            hideSelection
            columns={COLUMNS}
            count={data.totalCount}
            page={filters.pageNumber - 1}
            rowsPerPage={filters.pageSize}
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(page) => setPageNumber(page + 1)}
            onRowsPerPageChange={setPageSize}
            noData={<NoDisputes isFiltered={isFiltered} onClearFilters={clearFilters} />}
          >
            {data.items.map((dispute) => (
              <DisputeTableRow key={dispute.id} dispute={dispute} />
            ))}
          </SuperTable>
        </Box>
      )}
    </Box>
  );
};

/* ========================================================================================= */

export default DisputesPage;
