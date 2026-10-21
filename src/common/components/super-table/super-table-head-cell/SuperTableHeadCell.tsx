import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { headerCellSx, getColumnSx, toSxArray } from "../superTableUtils";
import type { SuperTableColumn } from "../types";

/* ============================================================================================ */

interface SuperTableHeadCellProps {
  sortBy?: string;
  column: SuperTableColumn;
  sortDirection?: "asc" | "desc";
  onSortChange?: (sortKey: string) => void;
}

const SuperTableHeadCell = ({ column, sortBy, sortDirection, onSortChange }: SuperTableHeadCellProps) => {
  const isSorted = !!column.sortKey && sortBy === column.sortKey;

  return (
    <TableCell
      align={column.align ?? "left"}
      sx={[
        ...toSxArray(headerCellSx),
        {
          fontWeight: 600,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "text.secondary",
          whiteSpace: "nowrap",
          width: column.width,
          minWidth: column.minWidth,
        },
        ...toSxArray(getColumnSx(column, "head")),
        ...toSxArray(column.headStyles),
      ]}
    >
      <TableSortLabel
        active={isSorted}
        disabled={!column.sortKey}
        hideSortIcon
        direction={isSorted ? sortDirection : undefined}
        onClick={() => column.sortKey && onSortChange?.(column.sortKey)}
        sx={{
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit !important",
          textTransform: "inherit",
          letterSpacing: "inherit",
          "&.Mui-disabled": { color: "inherit !important" },
        }}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  );
};

/* ============================================================================================ */

export default SuperTableHeadCell;
