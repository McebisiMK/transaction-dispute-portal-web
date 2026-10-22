import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SuperTableHeadCell } from "./super-table-head-cell";
import type { SuperTableColumn } from "./types";
import { headerCellSx, getColumnSx, getScrollContainerSx } from "./superTableUtils";
import { SuperTablePagination } from "./super-table-pagination";

/* ============================================================================================ */

export interface SuperTableProps {
  page: number;
  count: number;
  sortBy?: string;
  loading?: boolean;
  noData?: ReactNode;
  rowsPerPage: number;
  children: ReactNode;
  hasActions?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  hideSelection?: boolean;
  hidePagination?: boolean;
  columns: SuperTableColumn[];
  sortDirection?: 'asc' | 'desc';
  rowsPerPageOptions?: number[];
  onSelectAll?: () => void;
  onPageChange: (page: number) => void;
  onSortChange?: (sortKey: string) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const SuperTable = ({ columns, count, page, rowsPerPage, onPageChange, onRowsPerPageChange, children, allSelected = false, someSelected = false, onSelectAll, hasActions = false, noData: emptySlot, loading = false, sortBy, sortDirection = 'asc', onSortChange, rowsPerPageOptions, hideSelection = false, hidePagination = false, }: SuperTableProps) => {
  const showSelection = !hideSelection;
  const colspan = columns.length + (showSelection ? 1 : 0) + (hasActions ? 1 : 0);
  const hasRows = !loading && count > 0;
  const headRef = useRef<HTMLTableSectionElement>(null);
  const [headHeight, setHeadHeight] = useState(0);

  useLayoutEffect(() => {
    const head = headRef.current;
    if (!head) return;

    const measure = () => setHeadHeight(head.offsetHeight);
    measure();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(head);

    return () => observer.disconnect();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 16px 0 rgba(0,0,0,0.45)"
            : "0 4px 16px 0 rgba(0,0,0,0.10), 0 1px 4px 0 rgba(0,0,0,0.06)",
      }}
    >
      <TableContainer sx={getScrollContainerSx(headHeight)}>
        <Table stickyHeader>
          <TableHead ref={headRef}>
            <TableRow>
              {showSelection && (
                <TableCell padding="checkbox" sx={headerCellSx}>
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={onSelectAll}
                    disabled={loading}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <SuperTableHeadCell
                  key={col.id}
                  column={col}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortChange={onSortChange}
                />
              ))}
              {hasActions && <TableCell sx={headerCellSx} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  {showSelection && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align ?? 'left'} sx={getColumnSx(col, 'body')}>
                      <Skeleton />
                    </TableCell>
                  ))}
                  {hasActions && <TableCell><Skeleton /></TableCell>}
                </TableRow>
              ))
            ) : hasRows ? (
              children
            ) : (
              <TableRow>
                <TableCell colSpan={colspan} sx={{ border: 0, p: 0 }}>
                  {emptySlot}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!hidePagination && (
        <SuperTablePagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </Paper>
  );
};

/* ============================================================================================ */

export default SuperTable;
