import type { ChipProps } from '@mui/material/Chip';
import type { TransactionStatus } from '@/codegen/api-client';
import { StatusChip } from '@/common/components/status-chip';
import { getLookupName, useTransactionStatuses } from '@/common/lookups';
import { TRANSACTION_STATUS_COLORS } from '../../constants';

/* ==================================================================================== */

interface TransactionStatusChipProps {
  status: TransactionStatus;
  size?:  ChipProps['size'];
}

const TransactionStatusChip = ({ status, size }: TransactionStatusChipProps) => {
  const statuses = useTransactionStatuses();

  return <StatusChip label={getLookupName(statuses, status)} color={TRANSACTION_STATUS_COLORS[status]} size={size} />;
};

/* ==================================================================================== */

export default TransactionStatusChip;
