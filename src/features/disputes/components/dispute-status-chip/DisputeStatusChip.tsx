import Box from '@mui/material/Box';
import Chip, { type ChipProps } from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import type { DisputeStatus } from '@/codegen/api-client';
import { DISPUTE_STATUS_COLORS, DISPUTE_STATUS_LABELS } from '../../constants';

/* ==================================================================================== */

interface DisputeStatusChipProps {
  status: DisputeStatus;
  size?:  ChipProps['size'];
}

const DisputeStatusChip = ({ status, size = 'small' }: DisputeStatusChipProps) => {
  const color = DISPUTE_STATUS_COLORS[status];

  return (
    <Chip
      size={size}
      variant="outlined"
      label={DISPUTE_STATUS_LABELS[status]}
      icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />}
      sx={(theme) => {
        const main = color === 'default' || !color ? theme.palette.grey[500] : theme.palette[color].main;
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
};

/* ==================================================================================== */

export default DisputeStatusChip;
