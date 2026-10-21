import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { MeshBackground } from './mesh-background';
import { LoaderRings } from './loader-rings';
import { StatusText, STATUS_MESSAGES } from './status-text';
import { ProgressBar } from './progress-bar';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1);   }
`;

/* ===================================================================================================== */

const PageLoader = () => {
  const [statusIdx, setStatusIdx] = useState(0);
  const [statusKey, setStatusKey] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
      setStatusKey((k) => k + 1);
    }, 6000);

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 95 ? p + Math.random() * 5 : p));
    }, 2000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        animation: `${fadeIn} 0.4s ease both`,
      }}
    >
      <MeshBackground />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <LoaderRings />
        <StatusText statusIdx={statusIdx} statusKey={statusKey} />
        <ProgressBar progress={progress} />
      </Box>
    </Box>
  );
};

/* ===================================================================================================== */

export default PageLoader;
