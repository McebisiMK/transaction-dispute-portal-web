import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

/*==========================================================================================================================*/

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton animation="wave" variant="text" width={120} height={16} />
      <Skeleton animation="wave" variant="text" width={160} height={13} sx={{ mt: 0.25 }} />
    </TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={130} height={16} /></TableCell>
    <TableCell align="right"><Skeleton animation="wave" variant="text" width={80} height={16} sx={{ ml: 'auto' }} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={140} height={16} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="rounded" width={88} height={24} sx={{ borderRadius: '100px' }} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={80} height={16} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={80} height={16} /></TableCell>
    <TableCell padding="none" align="right" sx={{ pr: 1 }}><Skeleton animation="wave" variant="circular" width={28} height={28} /></TableCell>
  </TableRow>
);

/*==========================================================================================================================*/

export default SkeletonRow;
