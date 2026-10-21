import type { ChipProps } from '@mui/material/Chip';
import type { DisputeStatus } from '@/codegen/api-client';
import { StatusChip } from '@/common/components/status-chip';
import { DISPUTE_STATUS_COLORS, DISPUTE_STATUS_LABELS } from '../../constants';

/* ==================================================================================== */

interface DisputeStatusChipProps {
  status: DisputeStatus;
  size?:  ChipProps['size'];
}

const DisputeStatusChip = ({ status, size }: DisputeStatusChipProps) => (
  <StatusChip label={DISPUTE_STATUS_LABELS[status]} color={DISPUTE_STATUS_COLORS[status]} size={size} />
);

/* ==================================================================================== */

export default DisputeStatusChip;
