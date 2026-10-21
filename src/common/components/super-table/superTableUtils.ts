import type { SxProps, Theme } from "@mui/material/styles";
import type { SuperTableColumn } from "./types";

export const headerCellSx: SxProps<Theme> = {
  bgcolor: (theme) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
};

// Lets several SxProps (each may itself be an array) be merged in one sx array.
export const toSxArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export const getColumnSx =(column: SuperTableColumn, context: "head" | "body"): SxProps<Theme> => {
  if (!column.sticky) return {};
  return {
    position: "sticky",
    ...(column.sticky.variant === "start"
      ? {
          left: column.sticky.position,
          ...(column.sticky.border && { borderRight: (theme: Theme) => `1px solid ${theme.palette.divider}` }),
        }
      : {
          right: column.sticky.position,
          ...(column.sticky.border && { borderLeft: (theme: Theme) => `1px solid ${theme.palette.divider}` }),
        }),
    zIndex: context === "head" ? 4 : 1,
    ...(context === "body" && { bgcolor: "background.paper" }),
  };
};
