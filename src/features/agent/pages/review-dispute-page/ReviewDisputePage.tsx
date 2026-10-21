import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import type { DisputeStatus } from '@/codegen/api-client';
import { CONFIG } from '@/config-global';
import CustomBreadcrumbs from '@/common/components/custom-breadcrumbs';
import { ErrorFallback } from '@/common/components/error-boundary';
import { NoData } from '@/common/components/super-table';
import { DetailCard, DetailRow, DisputeDetailsSkeleton, DisputeSummaryCard, TransactionSummaryCard } from '@/features/disputes/components/dispute-details';
import { DisputeTimeline } from '@/features/disputes/components/dispute-timeline';
import { getErrorMessage, getFieldErrors, isApiException } from '@/lib/apiErrors';
import { snackbarSuccess } from '@/lib/snackbarRef';
import { useAgentDispute, useUpdateDisputeStatus } from '../../queries';
import { ReviewActions } from '../../components/review-actions';

/* ========================================================================================= */

const SUCCESS_MESSAGES: Partial<Record<DisputeStatus, string>> = {
  UnderReview: 'Review started for',
  Approved:    'Approved',
  Rejected:    'Rejected',
};

const CONFLICT_MESSAGE = "Someone else updated this dispute while you were working on it, so your change wasn't saved. The latest version is shown below.";

const ReviewDisputePage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: dispute, isPending, isError, error, refetch } = useAgentDispute(id);
  const updateStatus = useUpdateDisputeStatus(id);
  const isNotFound = isApiException(error) && error.status === 404;

  const isConflict = isApiException(updateStatus.error) && updateStatus.error.status === 409;
  const commentError = getFieldErrors(updateStatus.error).comment;
  const actionError = !updateStatus.isError || commentError ? undefined : isConflict ? CONFLICT_MESSAGE : getErrorMessage(updateStatus.error);

  const changeStatus = (status: DisputeStatus, comment?: string) => {
    if (!dispute) return;
    updateStatus.mutate(
      { status, comment, rowVersion: dispute.rowVersion },
      { onSuccess: (updated) => snackbarSuccess(`${SUCCESS_MESSAGES[status]} ${updated.reference}.`) },
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>{dispute?.reference ?? 'Dispute'} | {CONFIG.appName}</title>
      </Helmet>

      <Box sx={{ mb: 4, mt: -2 }}>
        <CustomBreadcrumbs
          heading={dispute?.reference ?? 'Dispute'}
          links={[{ name: 'Agent' }, { name: 'Dispute queue', href: '/agent/disputes' }, { name: dispute?.reference ?? 'Review' }]}
          action={
            <Button component={RouterLink} to="/agent/disputes" variant="outlined" startIcon={<ArrowBackIcon />}>
              Back to queue
            </Button>
          }
        />
      </Box>

      {isPending && <DisputeDetailsSkeleton />}

      {isNotFound && <NoData icon="search_off" message="Dispute not found" description="This dispute doesn't exist." />}

      {isError && !isNotFound && <ErrorFallback error={new Error(getErrorMessage(error))} onReset={() => refetch()} />}

      {!!dispute && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DisputeSummaryCard dispute={dispute} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TransactionSummaryCard transaction={dispute.transaction} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DetailCard title="Customer" icon={<PersonOutlinedIcon />} iconColor="secondary">
              <DetailRow label="Name" value={dispute.customerName} />
              <DetailRow label="Email" value={dispute.customerEmail} />
            </DetailCard>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <DetailCard title="Review" icon={<FactCheckOutlinedIcon />} iconColor="info">
              <ReviewActions
                key={dispute.status}
                status={dispute.status}
                isSubmitting={updateStatus.isPending}
                error={actionError}
                commentError={commentError}
                onStartReview={(comment) => changeStatus('UnderReview', comment)}
                onResolve={(outcome, comment) => changeStatus(outcome, comment)}
                onEdit={() => updateStatus.isError && updateStatus.reset()}
              />
            </DetailCard>
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

export default ReviewDisputePage;
