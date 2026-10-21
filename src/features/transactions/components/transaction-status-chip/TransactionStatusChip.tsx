import type { ChipProps } from '@mui/material/Chip';
import type { TransactionStatus } from '@/codegen/api-client';
import { StatusChip } from '@/common/components/status-chip';
import { TRANSACTION_STATUS_COLORS, TRANSACTION_STATUS_LABELS } from '../../constants';

/* ==================================================================================== */

interface TransactionStatusChipProps {
  status: TransactionStatus;
  size?:  ChipProps['size'];
}

const TransactionStatusChip = ({ status, size }: TransactionStatusChipProps) => (
  <StatusChip label={TRANSACTION_STATUS_LABELS[status]} color={TRANSACTION_STATUS_COLORS[status]} size={size} />
);

/* ==================================================================================== */

export default TransactionStatusChip;
