import type { SxProps, Theme } from "@mui/material/styles";

/* ============================================================================================ */

export interface SuperTableColumn {
  id: string;
  label: string;
  sortKey?: string;
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  sticky?: { variant: "start" | "end"; position: number; border?: boolean };
  headStyles?: SxProps<Theme>;
}
