import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { DisputeQueueItemModel } from '@/codegen/api-client';
import { formatCurrency, formatDate } from '@/common/utils/format';
import { DisputeStatusChip } from '@/features/disputes/components/dispute-status-chip';
import { DISPUTE_REASON_LABELS } from '@/features/disputes/constants';

/* ==================================================================================== */

interface QueueTableRowProps {
  dispute: DisputeQueueItemModel;
}

const QueueTableRow = ({ dispute }: QueueTableRowProps) => {
  const navigate = useNavigate();
  const openDispute = () => navigate(`/agent/disputes/${dispute.id}`);

  return (
    <TableRow hover onClick={openDispute} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
          {dispute.reference}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{dispute.customerName}</Typography>
      </TableCell>

      <TableCell>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {dispute.merchant}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dispute.transactionReference}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          {formatCurrency(dispute.amount, dispute.currency)}
        </Typography>
      </TableCell>

      <TableCell sx={{ pl: 5 }}>
        <Typography variant="body2">{DISPUTE_REASON_LABELS[dispute.reason]}</Typography>
      </TableCell>

      <TableCell align="center">
        <DisputeStatusChip status={dispute.status} />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          {formatDate(dispute.submittedAt)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {formatDate(dispute.lastUpdatedAt)}
        </Typography>
      </TableCell>

      <TableCell padding="none" align="right" sx={{ pr: 1 }}>
        <Tooltip title="Review dispute">
          <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label={`Review dispute ${dispute.reference}`}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

/* ==================================================================================== */

export default QueueTableRow;
