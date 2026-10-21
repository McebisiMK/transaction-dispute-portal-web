import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { NoData } from '@/common/components/super-table';
import { CLOSED_DISPUTE_MESSAGE, PENDING_DISPUTE_MESSAGE } from '@/features/transactions/constants';
import { useTransaction } from '@/features/transactions/queries';
import { getErrorMessage, getFieldErrors, isApiException } from '@/lib/apiErrors';
import { snackbarSuccess } from '@/lib/snackbarRef';
import { useCreateDispute } from '../../queries';
import { DisputeForm, type DisputeFormValues } from '../../components/dispute-form';
import { DetailCard, DisputeDetailsSkeleton, TransactionSummaryCard } from '../../components/dispute-details';

/* ========================================================================================= */

const CreateDisputePage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transaction, isPending, isError, error, refetch } = useTransaction(id);
  const createDispute = useCreateDispute();
  const isNotFound = isApiException(error) && error.status === 404;

  const fieldErrors = getFieldErrors(createDispute.error);
  const formError = createDispute.isError
    ? fieldErrors.transactionId ?? (fieldErrors.reason || fieldErrors.description ? undefined : getErrorMessage(createDispute.error))
    : undefined;

  const handleSubmit = ({ reason, description }: DisputeFormValues) =>
    createDispute.mutate(
      { transactionId: id, reason, description },
      {
        onSuccess: (dispute) => {
          snackbarSuccess(`Dispute ${dispute.reference} submitted. You can follow its progress here.`);
          navigate(`/disputes/${dispute.id}`, { replace: true });
        },
      },
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Dispute transaction | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs
          heading="Dispute transaction"
          links={[{ name: 'Accounts' }, { name: 'Transactions', href: '/transactions' }, { name: transaction?.reference ?? 'Dispute' }]}
          action={
            <Button component={RouterLink} to="/transactions" variant="outlined" startIcon={<ArrowBackIcon />}>
              Back to transactions
            </Button>
          }
        />
      </Box>

      {isPending && <DisputeDetailsSkeleton />}

      {isNotFound && (
        <NoData icon="search_off" message="Transaction not found" description="This transaction doesn't exist or doesn't belong to your account." />
      )}

      {isError && !isNotFound && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!!transaction && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TransactionSummaryCard transaction={transaction} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <DetailCard title="Dispute details" icon={<GavelIcon />} iconColor="info">
              {transaction.isDisputable ? (
                <DisputeForm
                  isSubmitting={createDispute.isPending}
                  error={formError}
                  fieldErrors={fieldErrors}
                  onSubmit={handleSubmit}
                  onEdit={() => createDispute.isError && createDispute.reset()}
                  onCancel={() => navigate('/transactions')}
                />
              ) : (
                <Box sx={{ py: 2 }}>
                  {transaction.openDisputeId ? (
                    <Alert
                      severity="info"
                      action={
                        <Button color="inherit" size="small" component={RouterLink} to={`/disputes/${transaction.openDisputeId}`}>
                          View dispute
                        </Button>
                      }
                    >
                      This transaction already has an open dispute.
                    </Alert>
                  ) : (
                    <Alert severity="warning">{transaction.status === 'Pending' ? PENDING_DISPUTE_MESSAGE : CLOSED_DISPUTE_MESSAGE}</Alert>
                  )}
                </Box>
              )}
            </DetailCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

/* ========================================================================================= */

export default CreateDisputePage;
