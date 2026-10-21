import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import GavelIcon from '@mui/icons-material/Gavel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { TransactionModel } from '@/codegen/api-client';

/* ==================================================================================== */

interface TransactionDisputeCellProps {
  transaction: TransactionModel;
}

const PENDING_REASON = "Pending transactions can be disputed once they've posted.";
const CLOSED_REASON  = 'This transaction can no longer be disputed.';

const TransactionDisputeCell = ({ transaction }: TransactionDisputeCellProps) => {
  const { id, merchant, reference, status, isDisputable, openDisputeId } = transaction;

  if (openDisputeId) {
    return (
      <Button
        size="small"
        color="info"
        component={RouterLink}
        to={`/disputes/${openDisputeId}`}
        endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
        aria-label={`View dispute for ${merchant} ${reference}`}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Disputed
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
    <Tooltip title={status === 'Pending' ? PENDING_REASON : CLOSED_REASON}>
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
