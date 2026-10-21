import Grid from '@mui/material/Grid';
import { CardSkeleton } from './card-skeleton';

/*==========================================================================================================================*/

const DisputeDetailsSkeleton = () => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <CardSkeleton rows={5} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <CardSkeleton rows={6} />
    </Grid>
    <Grid size={12}>
      <CardSkeleton rows={4} />
    </Grid>
  </Grid>
);

/*==========================================================================================================================*/

export default DisputeDetailsSkeleton;
