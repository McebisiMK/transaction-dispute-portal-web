import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { headerCellSx } from '@/common/components/super-table/superTableUtils';
import { SkeletonRow } from './skeleton-row';

/*==========================================================================================================================*/

const HEAD_COLS = ['Transaction', 'Reference', 'Amount', 'Reason', 'Status', 'Submitted', 'Last updated'];
const ROW_COUNT = 10;

const DisputeTableSkeleton = () => (
  <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {HEAD_COLS.map((col) => (
              <TableCell key={col} sx={headerCellSx}>
                <Skeleton animation="wave" variant="text" width="60%" height={16} />
              </TableCell>
            ))}
            <TableCell sx={headerCellSx} />
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', px: 2, py: 1, gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Skeleton animation="wave" variant="text" width={120} height={20} />
      <Skeleton animation="wave" variant="rounded" width={64} height={32} />
    </Box>
  </Paper>
);

/*==========================================================================================================================*/

export default DisputeTableSkeleton;
