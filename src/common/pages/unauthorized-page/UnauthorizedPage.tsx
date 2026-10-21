import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CONFIG } from '@/config-global';

/* ====================================================================================================== */

const UnauthorizedPage = () => (
  <>
    <Helmet>
      <title>403 Unauthorized | {CONFIG.appName}</title>
    </Helmet>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '6rem', lineHeight: 1 }}>
        403
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Access denied
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>You don't have permission to view this page.</Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 1 }}>
        Go to home
      </Button>
    </Box>
  </>
);

/* ====================================================================================================== */

export default UnauthorizedPage;
