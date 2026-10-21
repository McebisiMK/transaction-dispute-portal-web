import TablePagination from '@mui/material/TablePagination';

/* ============================================================================================ */

export interface SuperTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

const SuperTablePagination = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange, rowsPerPageOptions = [5, 10, 25], }: SuperTablePaginationProps) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Items per page:"
      sx={{ flexShrink: 0, borderTop: '1px solid', borderColor: 'divider' }}
    />
  );
};

/* ============================================================================================ */

export default SuperTablePagination;
