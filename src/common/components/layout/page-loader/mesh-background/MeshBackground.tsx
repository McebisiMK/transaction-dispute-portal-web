import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { useTheme, alpha } from '@mui/material/styles';

/* =============================================================================================================== */

const pulseGradient = keyframes`
  0%   { opacity: 0.5; }
  100% { opacity: 1;   }
`;

const MeshBackground = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background:
          `radial-gradient(circle at 0% 0%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 40%), ` +
          `radial-gradient(circle at 100% 100%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 40%)`,
        animation: `${pulseGradient} 10s ease-in-out infinite alternate`,
        pointerEvents: 'none',
      }}
    />
  );
};

/* =============================================================================================================== */

export default MeshBackground;
