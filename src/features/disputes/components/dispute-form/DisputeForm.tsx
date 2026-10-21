import { useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { DisputeReason } from '@/codegen/api-client';
import { DISPUTE_DESCRIPTION_MAX_LENGTH, DISPUTE_REASON_LABELS, DISPUTE_REASONS } from '../../constants';

/* ==================================================================================== */

export interface DisputeFormValues {
  reason:       DisputeReason;
  description?: string;
}

export interface DisputeFormProps {
  isSubmitting?: boolean;
  error?:        string;
  fieldErrors?:  Partial<Record<keyof DisputeFormValues, string>>;
  onSubmit:      (values: DisputeFormValues) => void;
  onEdit?:       () => void;
  onCancel:      () => void;
}

const REASON_REQUIRED      = 'Choose why you are disputing this transaction.';
const DESCRIPTION_REQUIRED = 'Tell us what happened when the reason is Other.';

const DisputeForm = ({ isSubmitting = false, error, fieldErrors = {}, onSubmit, onEdit, onCancel }: DisputeFormProps) => {
  const [reason, setReason] = useState<DisputeReason | ''>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasonError      = (submitted && !reason ? REASON_REQUIRED : undefined) ?? fieldErrors.reason;
  const descriptionError = (submitted && reason === 'Other' && !description.trim() ? DESCRIPTION_REQUIRED : undefined) ?? fieldErrors.description;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!reason || (reason === 'Other' && !description.trim())) return;
    onSubmit({ reason, description: description.trim() || undefined });
  };

  return (
    <Stack component="form" noValidate spacing={3} onSubmit={handleSubmit} sx={{ py: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        select
        required
        label="Reason"
        value={reason}
        disabled={isSubmitting}
        error={!!reasonError}
        helperText={reasonError}
        onChange={(event) => {
          setReason(event.target.value as DisputeReason);
          onEdit?.();
        }}
      >
        {DISPUTE_REASONS.map((option) => (
          <MenuItem key={option} value={option}>
            {DISPUTE_REASON_LABELS[option]}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        multiline
        minRows={5}
        label="Description"
        required={reason === 'Other'}
        placeholder="Anything that helps us look into this, such as what you expected to be charged."
        value={description}
        disabled={isSubmitting}
        error={!!descriptionError}
        helperText={descriptionError ?? `${description.length}/${DISPUTE_DESCRIPTION_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: DISPUTE_DESCRIPTION_MAX_LENGTH } }}
        onChange={(event) => {
          setDescription(event.target.value);
          onEdit?.();
        }}
      />

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Button variant="outlined" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          Submit dispute
        </Button>
      </Stack>
    </Stack>
  );
};

/* ==================================================================================== */

export default DisputeForm;
