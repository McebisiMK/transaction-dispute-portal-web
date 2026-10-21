import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import type { DisputeModel } from '@/codegen/api-client';
import { formatDateTime } from '@/common/utils/format';
import { DisputeStatusChip } from '../../dispute-status-chip';
import { DISPUTE_REASON_LABELS } from '../../../constants';
import { DetailCard } from '../detail-card';
import { DetailRow } from '../detail-row';
import { CopyableCode } from '../copyable-code';

/* ==================================================================================== */

interface DisputeSummaryCardProps {
  dispute: DisputeModel;
}

const DisputeSummaryCard = ({ dispute }: DisputeSummaryCardProps) => {
  const lastChange = dispute.timeline.at(-1);

  return (
    <DetailCard
      title="Dispute"
      icon={<DescriptionOutlinedIcon />}
      action={
        lastChange && (
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Updated {formatDateTime(lastChange.changedAt)}
          </Typography>
        )
      }
    >
      <DetailRow label="Reference" value={<CopyableCode value={dispute.reference} />} />
      <DetailRow label="Status" value={<DisputeStatusChip status={dispute.status} />} />
      <DetailRow label="Reason" value={DISPUTE_REASON_LABELS[dispute.reason]} />
      <DetailRow label="Description" value={dispute.description || '—'} block />
      <DetailRow label="Submitted" value={formatDateTime(dispute.submittedAt)} />
    </DetailCard>
  );
};

/* ==================================================================================== */

export default DisputeSummaryCard;
