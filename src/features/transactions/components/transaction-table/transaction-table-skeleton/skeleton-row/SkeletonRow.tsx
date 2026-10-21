import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

/*==========================================================================================================================*/

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton animation="wave" variant="text" width={140} height={16} />
      <Skeleton animation="wave" variant="text" width={120} height={13} sx={{ mt: 0.25 }} />
    </TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={80} height={16} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={130} height={16} /></TableCell>
    <TableCell><Skeleton animation="wave" variant="text" width={90} height={16} /></TableCell>
    <TableCell align="right"><Skeleton animation="wave" variant="text" width={80} height={16} sx={{ ml: 'auto' }} /></TableCell>
    <TableCell align="center"><Skeleton animation="wave" variant="rounded" width={72} height={24} sx={{ borderRadius: '100px', mx: 'auto' }} /></TableCell>
    <TableCell align="right"><Skeleton animation="wave" variant="rounded" width={96} height={30} sx={{ ml: 'auto' }} /></TableCell>
  </TableRow>
);

/*==========================================================================================================================*/

export default SkeletonRow;
