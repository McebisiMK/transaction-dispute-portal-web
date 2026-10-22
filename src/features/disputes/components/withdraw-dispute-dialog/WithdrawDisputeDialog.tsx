import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DISPUTE_COMMENT_MAX_LENGTH } from '../../constants';

/* ==================================================================================== */

export interface WithdrawDisputeDialogProps extends DialogProps {
  reference:      string;
  isLoading?:     boolean;
  error?:         string;
  onConfirmClick: (comment?: string) => void;
  onCancelClick:  () => void;
}

const WithdrawDisputeDialog = ({ reference, isLoading = false, error, onConfirmClick, onCancelClick, ...props }: WithdrawDisputeDialogProps) => {
  const [comment, setComment] = useState('');

  return (
    <Dialog maxWidth="sm" fullWidth {...props}>
      <DialogTitle>Withdraw dispute {reference}?</DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            We'll stop looking into this transaction. You can dispute it again later while it's still within the dispute window.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            multiline
            minRows={3}
            label="Comment (optional)"
            placeholder="For example, the merchant refunded me."
            value={comment}
            disabled={isLoading}
            helperText={`${comment.length}/${DISPUTE_COMMENT_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: DISPUTE_COMMENT_MAX_LENGTH } }}
            onChange={(event) => setComment(event.target.value)}
          />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" disabled={isLoading} onClick={onCancelClick}>
          Cancel
        </Button>
        <Button variant="contained" color="error" loading={isLoading} onClick={() => onConfirmClick(comment.trim() || undefined)}>
          Withdraw
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ==================================================================================== */

export default WithdrawDisputeDialog;
