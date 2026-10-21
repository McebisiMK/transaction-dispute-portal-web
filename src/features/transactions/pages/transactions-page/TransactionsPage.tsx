import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { SuperTable, type SuperTableColumn } from '@/common/components/super-table';
import { PAGE_SIZE_OPTIONS } from '@/common/constants/paging';
import { getErrorMessage } from '@/lib/apiErrors';
import { useTransactions } from '../../queries';
import { useTransactionFilters } from '../../hooks/useTransactionFilters';
import { NoTransactions, TransactionTableRow, TransactionTableSkeleton, TransactionTableToolbar } from '../../components/transaction-table';

/* ========================================================================================= */

const COLUMNS: SuperTableColumn[] = [
  { id: 'merchant', label: 'Merchant', width: '20%' },
  { id: 'transactionDate', label: 'Date', width: '11%' },
  { id: 'account', label: 'Account', width: '18%' },
  { id: 'category', label: 'Category', width: '13%' },
  { id: 'amount', label: 'Amount', align: 'right', width: '12%' },
  { id: 'status', label: 'Status', align: 'center', width: '12%' },
  { id: 'dispute', label: 'Dispute', align: 'right', width: '14%' },
];

const TransactionsPage = () => {
  const { filters, isFiltered, setSearch, setStatus, setFromDate, setToDate, setPageNumber, setPageSize, clearFilters } = useTransactionFilters();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useTransactions(filters);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet>
        <title>Transactions | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs heading="Transactions" links={[{ name: 'Accounts' }, { name: 'Transactions' }]} />
      </Box>

      <TransactionTableToolbar
        search={filters.search}
        status={filters.status}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        isFiltered={isFiltered}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFromDate}
        onToChange={setToDate}
        onClear={clearFilters}
      />

      {isPending && <TransactionTableSkeleton />}
      {isError && !data && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!!data && (
        <Box sx={{ mb: -2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {isFetching && isPlaceholderData && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }} />}

          <SuperTable
            hideSelection
            columns={COLUMNS}
            count={data.totalCount}
            page={filters.pageNumber - 1}
            rowsPerPage={filters.pageSize}
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(page) => setPageNumber(page + 1)}
            onRowsPerPageChange={setPageSize}
            noData={<NoTransactions isFiltered={isFiltered} onClearFilters={clearFilters} />}
          >
            {data.items.map((transaction) => (
              <TransactionTableRow key={transaction.id} transaction={transaction} />
            ))}
          </SuperTable>
        </Box>
      )}
    </Box>
  );
};

/* ========================================================================================= */

export default TransactionsPage;
