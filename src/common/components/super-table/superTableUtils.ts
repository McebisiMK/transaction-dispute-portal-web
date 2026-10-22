import type { SxProps, Theme } from "@mui/material/styles";
import type { SuperTableColumn } from "./types";

const getHeaderBackground = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.grey[800]
    : theme.palette.grey[100];

export const headerCellSx: SxProps<Theme> = {
  bgcolor: getHeaderBackground,
};

export const getScrollContainerSx = (headHeight: number): SxProps<Theme> => ({
  flex: 1,
  overflow: "auto",
  background: (theme: Theme) =>
    `linear-gradient(to bottom, ${getHeaderBackground(theme)} ${headHeight}px, transparent ${headHeight}px)`,
  "&::-webkit-scrollbar": { width: 10, height: 10 },
  "&::-webkit-scrollbar-track": { marginTop: `${headHeight}px` },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: 5,
    border: "2px solid transparent",
    backgroundClip: "padding-box",
    bgcolor: (theme: Theme) => theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[400],
  },
  "&::-webkit-scrollbar-corner": { bgcolor: "transparent" },
});

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
