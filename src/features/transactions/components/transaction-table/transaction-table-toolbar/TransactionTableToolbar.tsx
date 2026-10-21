import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isValid } from 'date-fns';
import type { TransactionStatus } from '@/codegen/api-client';
import { useDebouncedValue } from '@/common/hooks';
import { fromApiDate, toApiDate } from '@/common/utils/format';
import { SEARCH_DEBOUNCE_MS, TRANSACTION_STATUSES, TRANSACTION_STATUS_LABELS } from '../../../constants';

/* ========================================================================================================================================= */

interface TransactionTableToolbarProps {
  search?:        string;
  status?:        TransactionStatus;
  fromDate?:      string;
  toDate?:        string;
  isFiltered:     boolean;
  onSearchChange: (value?: string) => void;
  onStatusChange: (value?: TransactionStatus) => void;
  onFromChange:   (value?: string) => void;
  onToChange:     (value?: string) => void;
  onClear:        () => void;
}

const ANY = 'Any';

const toFilterDate = (value: Date | null): string | undefined => (value && isValid(value) ? toApiDate(value) : undefined);

const TransactionTableToolbar = ({ search = '', status, fromDate, toDate, isFiltered, onSearchChange, onStatusChange, onFromChange, onToChange, onClear }: TransactionTableToolbarProps) => {
  const [input, setInput] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);
  const debounced = useDebouncedValue(input.trim(), SEARCH_DEBOUNCE_MS);

  if (search !== lastSearch) {
    setLastSearch(search);
    if (search !== input.trim()) setInput(search);
  }

  useEffect(() => {
    if (debounced === input.trim() && debounced !== search) onSearchChange(debounced || undefined);
  }, [debounced, input, search, onSearchChange]);

  const from = fromApiDate(fromDate ?? null);
  const to = fromApiDate(toDate ?? null);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
      <TextField
        size="small"
        label="Search"
        placeholder="Merchant or reference"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: 2, minWidth: 220, bgcolor: 'background.paper' }}
      />

      <TextField
        select
        size="small"
        label="Status"
        value={status ?? ANY}
        onChange={(e) => onStatusChange(e.target.value === ANY ? undefined : (e.target.value as TransactionStatus))}
        sx={{ flex: 1, minWidth: 160, bgcolor: 'background.paper' }}
      >
        <MenuItem value={ANY}>Any status</MenuItem>
        {TRANSACTION_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {TRANSACTION_STATUS_LABELS[s]}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="From"
        value={from}
        maxDate={to ?? undefined}
        disableFuture
        onChange={(value) => onFromChange(toFilterDate(value))}
        slotProps={{ textField: { size: 'small', sx: { flex: 1, minWidth: 170, bgcolor: 'background.paper' } }, field: { clearable: true } }}
      />

      <DatePicker
        label="To"
        value={to}
        minDate={from ?? undefined}
        disableFuture
        onChange={(value) => onToChange(toFilterDate(value))}
        slotProps={{ textField: { size: 'small', sx: { flex: 1, minWidth: 170, bgcolor: 'background.paper' } }, field: { clearable: true } }}
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

export default TransactionTableToolbar;
