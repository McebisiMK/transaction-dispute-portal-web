import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';

/* =============================================================================================================== */

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 256,
        height: 6,
        borderRadius: 99,
        backgroundColor: alpha(theme.palette.text.primary, 0.08),
        border: `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: 99,
          transition: 'width 0.5s ease-out',
        }}
      />
    </Box>
  );
};

/* =============================================================================================================== */

export default ProgressBar;
