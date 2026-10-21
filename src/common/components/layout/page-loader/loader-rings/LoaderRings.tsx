import Box from '@mui/material/Box';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { keyframes } from '@emotion/react';
import { useTheme, alpha } from '@mui/material/styles';

/* ================================================================================================================================== */

const spinCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinCCW = keyframes`
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
`;

const LoaderRings = () => {
  const theme = useTheme();

  const pulseGlow = keyframes`
    0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 10px ${theme.palette.primary.main}); opacity: 0.8; }
    50%       { transform: scale(1.1); filter: drop-shadow(0 0 25px ${theme.palette.primary.main}); opacity: 1;   }
  `;

  return (
    <Box sx={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        component="svg"
        viewBox="0 0 100 100"
        sx={{ position: 'absolute', width: '100%', height: '100%', color: 'primary.main', animation: `${spinCW} 4s linear infinite` }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeDasharray="70 200" />
      </Box>

      <Box
        component="svg"
        viewBox="0 0 100 100"
        sx={{ position: 'absolute', width: '80%', height: '80%', color: 'secondary.main', animation: `${spinCCW} 3s linear infinite` }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={3} />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeDasharray="40 240" />
      </Box>

      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${pulseGlow} 2s ease-in-out infinite`,
          boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}
      >
        <RocketLaunchIcon sx={{ color: 'primary.contrastText', fontSize: 28 }} />
      </Box>
    </Box>
  );
};

/* ================================================================================================================================== */

export default LoaderRings;
