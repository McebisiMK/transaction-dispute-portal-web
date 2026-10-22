import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isValid } from 'date-fns';
import type { DisputeStatus } from '@/codegen/api-client';
import { fromApiDate, toApiDate } from '@/common/utils/format';
import { useDisputeStatuses } from '@/common/lookups';

/* ========================================================================================================================================= */

interface DisputeTableToolbarProps {
  status?:        DisputeStatus;
  fromDate?:      string;
  toDate?:        string;
  isFiltered:     boolean;
  onStatusChange: (value?: DisputeStatus) => void;
  onFromChange:   (value?: string) => void;
  onToChange:     (value?: string) => void;
  onClear:        () => void;
}

const ANY = 'Any';
const toFilterDate = (value: Date | null): string | undefined => (value && isValid(value) ? toApiDate(value) : undefined);

const DisputeTableToolbar = ({ status, fromDate, toDate, isFiltered, onStatusChange, onFromChange, onToChange, onClear }: DisputeTableToolbarProps) => {
  const statuses = useDisputeStatuses();
  const from = fromApiDate(fromDate ?? null);
  const to = fromApiDate(toDate ?? null);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
      <TextField
        select
        size="small"
        label="Status"
        value={status ?? ANY}
        onChange={(e) => onStatusChange(e.target.value === ANY ? undefined : (e.target.value as DisputeStatus))}
        sx={{ flex: 1, minWidth: 180, bgcolor: 'background.paper' }}
      >
        <MenuItem value={ANY}>Any status</MenuItem>
        {statuses.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Submitted from"
        value={from}
        maxDate={to ?? undefined}
        disableFuture
        onChange={(value) => onFromChange(toFilterDate(value))}
        slotProps={{ textField: { size: 'small', sx: { flex: 1, minWidth: 180, bgcolor: 'background.paper' } }, field: { clearable: true } }}
      />

      <DatePicker
        label="Submitted to"
        value={to}
        minDate={from ?? undefined}
        disableFuture
        onChange={(value) => onToChange(toFilterDate(value))}
        slotProps={{ textField: { size: 'small', sx: { flex: 1, minWidth: 180, bgcolor: 'background.paper' } }, field: { clearable: true } }}
      />

      {isFiltered && (
        <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={onClear} sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          Clear
        </Button>
      )}
    </Box>
  );
};

/* ========================================================================================================================================= */

export default DisputeTableToolbar;
