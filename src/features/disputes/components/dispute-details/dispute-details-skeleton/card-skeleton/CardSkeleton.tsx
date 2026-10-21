import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

/*==========================================================================================================================*/

interface CardSkeletonProps {
  rows: number;
}

const CardSkeleton = ({ rows }: CardSkeletonProps) => (
  <Paper variant="outlined" sx={{ height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2.25, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Skeleton animation="wave" variant="rounded" width={36} height={36} />
      <Skeleton animation="wave" variant="text" width={120} height={28} />
    </Box>
    <Box sx={{ px: 3, py: 1 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.75 }}>
          <Skeleton animation="wave" variant="text" width={90} height={20} />
          <Skeleton animation="wave" variant="text" width="35%" height={20} />
        </Box>
      ))}
    </Box>
  </Paper>
);

/*==========================================================================================================================*/

export default CardSkeleton;
