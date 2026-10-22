import { useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { DisputeStatus } from '@/codegen/api-client';
import { getLookupName, useDisputeStatuses } from '@/common/lookups';
import { DISPUTE_COMMENT_MAX_LENGTH } from '@/features/disputes/constants';

/* ==================================================================================== */

export type DisputeOutcome = Extract<DisputeStatus, 'Approved' | 'Rejected'>;

export interface ReviewActionsProps {
  status:        DisputeStatus;
  isSubmitting?: boolean;
  error?:        string;
  commentError?: string;
  onStartReview: (comment?: string) => void;
  onResolve:     (outcome: DisputeOutcome, comment: string) => void;
  onEdit?:       () => void;
}

const OUTCOME_REQUIRED = 'Choose whether to approve or reject the dispute.';
const COMMENT_REQUIRED = 'Explain the decision to the customer.';

const ReviewActions = ({ status, isSubmitting = false, error, commentError, onStartReview, onResolve, onEdit }: ReviewActionsProps) => {
  const [outcome, setOutcome] = useState<DisputeOutcome | ''>('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const statuses = useDisputeStatuses();

  if (status !== 'Submitted' && status !== 'UnderReview') {
    return (
      <Stack spacing={2} sx={{ py: 2 }}>
        {error && <Alert severity="warning">{error}</Alert>}
        <Alert severity="info">This dispute is {getLookupName(statuses, status).toLowerCase()}. No further action is needed.</Alert>
      </Stack>
    );
  }

  const isResolving = status === 'UnderReview';
  const outcomeError = submitted && isResolving && !outcome ? OUTCOME_REQUIRED : undefined;
  const commentMessage = (submitted && isResolving && !comment.trim() ? COMMENT_REQUIRED : undefined) ?? commentError;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isResolving) return onStartReview(comment.trim() || undefined);

    setSubmitted(true);
    if (!outcome || !comment.trim()) return;
    onResolve(outcome, comment.trim());
  };

  return (
    <Stack component="form" noValidate spacing={2.5} onSubmit={handleSubmit} sx={{ py: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {isResolving
          ? 'Record the outcome. The customer sees your comment in their dispute history.'
          : 'Start the review so the customer knows someone is looking into it.'}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {isResolving && (
        <FormControl error={!!outcomeError} disabled={isSubmitting}>
          <FormLabel id="outcome-label">Outcome</FormLabel>
          <RadioGroup
            row
            aria-labelledby="outcome-label"
            value={outcome}
            onChange={(event) => {
              setOutcome(event.target.value as DisputeOutcome);
              onEdit?.();
            }}
          >
            <FormControlLabel value="Approved" control={<Radio color="success" />} label="Approve" />
            <FormControlLabel value="Rejected" control={<Radio color="error" />} label="Reject" />
          </RadioGroup>
          {outcomeError && <FormHelperText>{outcomeError}</FormHelperText>}
        </FormControl>
      )}

      <TextField
        multiline
        minRows={3}
        label={isResolving ? 'Comment' : 'Comment (optional)'}
        required={isResolving}
        value={comment}
        disabled={isSubmitting}
        error={!!commentMessage}
        helperText={commentMessage ?? `${comment.length}/${DISPUTE_COMMENT_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: DISPUTE_COMMENT_MAX_LENGTH } }}
        onChange={(event) => {
          setComment(event.target.value);
          onEdit?.();
        }}
      />

      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isResolving ? 'Resolve dispute' : 'Start review'}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ==================================================================================== */

export default ReviewActions;
