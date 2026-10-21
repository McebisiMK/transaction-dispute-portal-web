import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

/* ==================================================================================== */

type IconColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface DetailCardProps {
  title:      string;
  icon:       ReactNode;
  iconColor?: IconColor;
  action?:    ReactNode;
  children:   ReactNode;
}

const DetailCard = ({ title, icon, iconColor = 'primary', action, children }: DetailCardProps) => (
  <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2.25, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          color: `${iconColor}.main`,
          bgcolor: (theme) => alpha(theme.palette[iconColor].main, 0.12),
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette[iconColor].main, 0.24),
          '& svg': { fontSize: 20 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}>
        {title}
      </Typography>
      {action}
    </Box>
    <Box sx={{ px: 3, py: 1, flex: 1 }}>{children}</Box>
  </Paper>
);

/* ==================================================================================== */

export default DetailCard;
