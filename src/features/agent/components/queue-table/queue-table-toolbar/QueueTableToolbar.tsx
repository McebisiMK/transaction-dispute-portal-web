import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type { DisputeStatus } from '@/codegen/api-client';
import { DISPUTE_STATUSES, DISPUTE_STATUS_LABELS } from '@/features/disputes/constants';

/* ========================================================================================================================================= */

interface QueueTableToolbarProps {
  status?:        DisputeStatus;
  onStatusChange: (value?: DisputeStatus) => void;
}

const OPEN = 'Open';

const QueueTableToolbar = ({ status, onStatusChange }: QueueTableToolbarProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
    <TextField
      select
      size="small"
      label="Status"
      value={status ?? OPEN}
      onChange={(e) => onStatusChange(e.target.value === OPEN ? undefined : (e.target.value as DisputeStatus))}
      sx={{ minWidth: 260, bgcolor: 'background.paper' }}
    >
      <MenuItem value={OPEN}>Open (submitted and under review)</MenuItem>
      {DISPUTE_STATUSES.map((s) => (
        <MenuItem key={s} value={s}>
          {DISPUTE_STATUS_LABELS[s]}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

/* ========================================================================================================================================= */

export default QueueTableToolbar;
