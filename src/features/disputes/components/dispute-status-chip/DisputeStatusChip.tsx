import type { ChipProps } from '@mui/material/Chip';
import type { DisputeStatus } from '@/codegen/api-client';
import { StatusChip } from '@/common/components/status-chip';
import { getLookupName, useDisputeStatuses } from '@/common/lookups';
import { DISPUTE_STATUS_COLORS } from '../../constants';

/* ==================================================================================== */

interface DisputeStatusChipProps {
  status: DisputeStatus;
  size?:  ChipProps['size'];
}

const DisputeStatusChip = ({ status, size }: DisputeStatusChipProps) => {
  const statuses = useDisputeStatuses();

  return <StatusChip label={getLookupName(statuses, status)} color={DISPUTE_STATUS_COLORS[status]} size={size} />;
};

/* ==================================================================================== */

export default DisputeStatusChip;
