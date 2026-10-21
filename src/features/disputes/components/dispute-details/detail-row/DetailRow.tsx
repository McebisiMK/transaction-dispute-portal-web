import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { insetSx } from '../../../styles';

/* ================================================================================================================================ */

interface DetailRowProps {
  label:  string;
  value:  ReactNode;
  // Long free text reads better under the label than squeezed to the right.
  block?: boolean;
}

const DetailRow = ({ label, value, block = false }: DetailRowProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: block ? 'column' : 'row',
      alignItems: block ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: block ? 1 : 2,
      py: 1.75,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': { borderBottom: 0 },
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
      {label}
    </Typography>
    <Box
      sx={[
        { minWidth: 0, typography: 'body2', overflowWrap: 'anywhere' },
        block
          ? { p: 1.5, borderRadius: 1, whiteSpace: 'pre-wrap' }
          : { fontWeight: 600, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 },
        block && insetSx,
      ]}
    >
      {value}
    </Box>
  </Box>
);

/* ================================================================================================================================ */

export default DetailRow;
