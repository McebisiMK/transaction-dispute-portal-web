import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import GavelIcon from '@mui/icons-material/Gavel';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { TransactionModel } from '@/codegen/api-client';
import { CLOSED_DISPUTE_MESSAGE, PENDING_DISPUTE_MESSAGE } from '../../../../constants';

/* ==================================================================================== */

interface TransactionDisputeCellProps {
  transaction: TransactionModel;
}

const TransactionDisputeCell = ({ transaction }: TransactionDisputeCellProps) => {
  const { id, merchant, reference, status, isDisputable, openDisputeId } = transaction;

  if (openDisputeId) {
    return (
      <Button
        size="small"
        color="info"
        variant="outlined"
        component={RouterLink}
        to={`/disputes/${openDisputeId}`}
        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
        aria-label={`View dispute for ${merchant} ${reference}`}
        sx={{ whiteSpace: 'nowrap' }}
      >
        View dispute
      </Button>
    );
  }

  if (isDisputable) {
    return (
      <Button
        size="small"
        variant="outlined"
        component={RouterLink}
        to={`/transactions/${id}/dispute`}
        startIcon={<GavelIcon sx={{ fontSize: 16 }} />}
        aria-label={`Dispute ${merchant} ${reference}`}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Dispute
      </Button>
    );
  }

  return (
    <Tooltip title={status === 'Pending' ? PENDING_DISPUTE_MESSAGE : CLOSED_DISPUTE_MESSAGE}>
      <Box component="span" sx={{ display: 'inline-flex' }}>
        <Button size="small" variant="outlined" disabled startIcon={<GavelIcon sx={{ fontSize: 16 }} />} aria-label={`Dispute ${merchant} ${reference}`}>
          Dispute
        </Button>
      </Box>
    </Tooltip>
  );
};

/* ==================================================================================== */

export default TransactionDisputeCell;
