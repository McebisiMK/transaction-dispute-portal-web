import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@emotion/react';

/* =============================================================================================================== */

const fadeUp = keyframes`
  0%, 20%    { opacity: 0; transform: translateY(10px);  }
  25%, 75%   { opacity: 1; transform: translateY(0);      }
  80%, 100%  { opacity: 0; transform: translateY(-10px); }
`;

const STATUS_MESSAGES = [
  'Establishing secure connection...',
  'Optimizing workspace settings...',
  'Syncing interface components...',
  'Verifying encrypted protocols...',
  'Deploying core system modules...',
];

interface StatusTextProps {
  statusIdx: number;
  statusKey: number;
}

const StatusText = ({ statusIdx, statusKey }: StatusTextProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: '-0.01em', mb: 1 }}>
      Loading...
    </Typography>

    <Box sx={{ height: 24, overflow: 'hidden' }}>
      <Typography
        key={statusKey}
        variant="body2"
        sx={{ color: 'text.secondary', fontWeight: 500, animation: `${fadeUp} 6s linear both` }}
      >
        {STATUS_MESSAGES[statusIdx]}
      </Typography>
    </Box>
  </Box>
);

/* =============================================================================================================== */

export { STATUS_MESSAGES };
export default StatusText;
