import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CONFIG } from '@/config-global';

/* ======================================================================= */

const NotFoundPage = () => (
  <>
    <Helmet>
      <title>404 Not Found | {CONFIG.appName}</title>
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
      <Typography variant="h1" color="text.disabled" sx={{ fontWeight: 800, fontSize: '6rem', lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 1 }}>
        Go to home
      </Button>
    </Box>
  </>
);

/* ======================================================================= */

export default NotFoundPage;
