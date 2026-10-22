import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { DisputeSummaryModel } from '@/codegen/api-client';
import { formatCurrency, formatDate } from '@/common/utils/format';
import { DisputeStatusChip } from '../../dispute-status-chip';
import { getLookupName, useDisputeReasons } from '@/common/lookups';

/* ==================================================================================== */

interface DisputeTableRowProps {
  dispute: DisputeSummaryModel;
}

const DisputeTableRow = ({ dispute }: DisputeTableRowProps) => {
  const navigate = useNavigate();
  const reasons = useDisputeReasons();
  const openDispute = () => navigate(`/disputes/${dispute.id}`);

  return (
    <TableRow hover onClick={openDispute} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {dispute.merchant}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dispute.transactionReference} · {formatDate(dispute.transactionDate)}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
          {dispute.reference}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          {formatCurrency(dispute.amount, dispute.currency)}
        </Typography>
      </TableCell>

      <TableCell sx={{ pl: 5 }}>
        <Typography variant="body2">{getLookupName(reasons, dispute.reason)}</Typography>
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
        <Tooltip title="View dispute">
          <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label={`View dispute ${dispute.reference}`}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

/* ==================================================================================== */

export default DisputeTableRow;
