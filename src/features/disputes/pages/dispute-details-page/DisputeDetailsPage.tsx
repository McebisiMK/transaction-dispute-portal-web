import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import UndoIcon from '@mui/icons-material/Undo';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { useDialog } from '@/common/components/dialogs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { NoData } from '@/common/components/super-table';
import { getErrorMessage, isApiException } from '@/lib/apiErrors';
import { snackbarSuccess } from '@/lib/snackbarRef';
import { useDispute, useWithdrawDispute } from '../../queries';
import { DisputeTimeline } from '../../components/dispute-timeline';
import { WithdrawDisputeDialog } from '../../components/withdraw-dispute-dialog';
import { DetailCard, DisputeDetailsSkeleton, DisputeSummaryCard, TransactionSummaryCard } from '../../components/dispute-details';

/* ========================================================================================= */

const DisputeDetailsPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: dispute, isPending, isError, error, refetch } = useDispute(id);
  const isNotFound = isApiException(error) && error.status === 404;
  const withdrawDispute = useWithdrawDispute(id);
  const { showDialog } = useDialog();

  const handleWithdraw = (reference: string) => {
    const modal = showDialog(WithdrawDisputeDialog, {
      reference,
      onConfirmClick: (comment?: string) => {
        modal.update({ isLoading: true, error: undefined });
        withdrawDispute.mutate(comment, {
          onSuccess: () => {
            modal.hide();
            snackbarSuccess(`Dispute ${reference} withdrawn.`);
          },
          onError: (withdrawError) => modal.update({ isLoading: false, error: getErrorMessage(withdrawError) }),
        });
      },
      onCancelClick: () => modal.hide(),
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>{dispute?.reference ?? 'Dispute'} | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs
          heading={dispute?.reference ?? 'Dispute'}
          links={[{ name: 'Disputes' }, { name: 'History', href: '/disputes' }, { name: dispute?.reference ?? 'Details' }]}
          action={
            <Stack direction="row" spacing={1.5}>
              {dispute?.status === 'Submitted' && (
                <Button variant="outlined" color="error" startIcon={<UndoIcon />} onClick={() => handleWithdraw(dispute.reference)}>
                  Withdraw dispute
                </Button>
              )}
              <Button component={RouterLink} to="/disputes" variant="outlined" startIcon={<ArrowBackIcon />}>
                Back to disputes
              </Button>
            </Stack>
          }
        />
      </Box>

      {isPending && <DisputeDetailsSkeleton />}

      {isNotFound && (
        <NoData icon="search_off" message="Dispute not found" description="This dispute doesn't exist or doesn't belong to your account." />
      )}

      {isError && !isNotFound && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!!dispute && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DisputeSummaryCard dispute={dispute} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TransactionSummaryCard transaction={dispute.transaction} />
          </Grid>
          <Grid size={12}>
            <DetailCard
              title="History"
              icon={<HistoryRoundedIcon />}
              iconColor="secondary"
              action={
                <Typography variant="caption" color="text.secondary">
                  {dispute.timeline.length} {dispute.timeline.length === 1 ? 'event' : 'events'} recorded
                </Typography>
              }
            >
              <DisputeTimeline timeline={dispute.timeline} />
            </DetailCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

/* ========================================================================================= */

export default DisputeDetailsPage;
