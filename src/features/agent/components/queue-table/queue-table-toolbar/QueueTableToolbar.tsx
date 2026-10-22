import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type { DisputeStatus } from '@/codegen/api-client';
import { useDisputeStatuses } from '@/common/lookups';

/* ========================================================================================================================================= */

interface QueueTableToolbarProps {
  status?:        DisputeStatus;
  onStatusChange: (value?: DisputeStatus) => void;
}

const OPEN = 'Open';

const QueueTableToolbar = ({ status, onStatusChange }: QueueTableToolbarProps) => {
  const statuses = useDisputeStatuses();

  return (
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
        {statuses.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

/* ========================================================================================================================================= */

export default QueueTableToolbar;
