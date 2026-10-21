import Box from '@mui/material/Box';
import Chip, { type ChipProps } from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';

/* ==================================================================================== */

export interface StatusChipProps {
  label:  string;
  color?: ChipProps['color'];
  size?:  ChipProps['size'];
}

const StatusChip = ({ label, color = 'default', size = 'small' }: StatusChipProps) => (
  <Chip
    size={size}
    variant="outlined"
    label={label}
    icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />}
    sx={(theme) => {
      const main = color === 'default' ? theme.palette.grey[500] : theme.palette[color].main;
      return {
        fontWeight: 600,
        color: main,
        borderColor: alpha(main, 0.4),
        bgcolor: alpha(main, 0.12),
        '& .MuiChip-icon': { color: 'inherit', ml: 1, mr: -0.25 },
      };
    }}
  />
);

/* ==================================================================================== */

export default StatusChip;
