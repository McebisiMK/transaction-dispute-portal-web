import type { PopoverProps } from "@mui/material/Popover";
import Popover from "@mui/material/Popover";
import type { PopoverOrigin } from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

/* ==================================================================================== */

export type ArrowPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

export interface MenuPopoverProps extends Omit<PopoverProps, "open" | "sx"> {
  open: HTMLElement | null;
  arrow?: ArrowPlacement;
  disabledArrow?: boolean;
  width?: number;
  sx?: SxProps<Theme>;
}

const ARROW = 7;

const ARROW_BASE = {
  content: '""',
  width: ARROW * 2,
  height: ARROW * 2,
  position: "absolute",
  transform: "rotate(45deg)",
  bgcolor: "background.paper",
};

type PlacementConfig = {
  arrowSx: object;
  offset: SxProps<Theme>;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
};

const getPlacementConfig = (arrow: ArrowPlacement, shadowColor: string): PlacementConfig => {
  switch (arrow) {
    case "top-left":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "left" },
        offset: { mt: 1.5 },
        arrowSx: { ...ARROW_BASE, top: -ARROW, left: 20, boxShadow: `-2px -2px 4px -1px ${shadowColor}` },
      };

    case "top-center":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
        transformOrigin: { vertical: "top", horizontal: "center" },
        offset: { mt: 1.5 },
        arrowSx: { ...ARROW_BASE, top: -ARROW, left: "calc(50% - 7px)", boxShadow: `-2px -2px 4px -1px ${shadowColor}` },
      };

    case "top-right":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        offset: { mt: 1.5 },
        arrowSx: { ...ARROW_BASE, top: -ARROW, right: 20, boxShadow: `-2px -2px 4px -1px ${shadowColor}` },
      };

    case "bottom-left":
      return {
        anchorOrigin: { vertical: "top", horizontal: "left" },
        transformOrigin: { vertical: "bottom", horizontal: "left" },
        offset: { mb: 1.5 },
        arrowSx: { ...ARROW_BASE, bottom: -ARROW, left: 20, boxShadow: `3px 3px 4px -1px ${shadowColor}` },
      };

    case "bottom-center":
      return {
        anchorOrigin: { vertical: "top", horizontal: "center" },
        transformOrigin: { vertical: "bottom", horizontal: "center" },
        offset: { mb: 1.5 },
        arrowSx: { ...ARROW_BASE, bottom: -ARROW, left: "calc(50% - 7px)", boxShadow: `3px 3px 4px -1px ${shadowColor}` },
      };

    case "bottom-right":
      return {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        transformOrigin: { vertical: "bottom", horizontal: "right" },
        offset: { mb: 1.5 },
        arrowSx: { ...ARROW_BASE, bottom: -ARROW, right: 20, boxShadow: `3px 3px 4px -1px ${shadowColor}` },
      };

    case "left-top":
      return {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "left" },
        offset: { ml: 1.5 },
        arrowSx: { ...ARROW_BASE, top: 12, left: -ARROW, boxShadow: `-2px 2px 4px -1px ${shadowColor}` },
      };

    case "left-center":
      return {
        anchorOrigin: { vertical: "center", horizontal: "right" },
        transformOrigin: { vertical: "center", horizontal: "left" },
        offset: { ml: 1.5 },
        arrowSx: { ...ARROW_BASE, top: "calc(50% - 7px)", left: -ARROW, boxShadow: `-2px 2px 4px -1px ${shadowColor}` },
      };

    case "left-bottom":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "bottom", horizontal: "left" },
        offset: { ml: 1.5 },
        arrowSx: { ...ARROW_BASE, bottom: 12, left: -ARROW, boxShadow: `-2px 2px 4px -1px ${shadowColor}` },
      };

    case "right-top":
      return {
        anchorOrigin: { vertical: "top", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        offset: { mr: 1.5 },
        arrowSx: { ...ARROW_BASE, top: 12, right: -ARROW, boxShadow: `2px -2px 4px -1px ${shadowColor}` },
      };

    case "right-center":
      return {
        anchorOrigin: { vertical: "center", horizontal: "left" },
        transformOrigin: { vertical: "center", horizontal: "right" },
        offset: { mr: 1.5 },
        arrowSx: { ...ARROW_BASE, top: "calc(50% - 7px)", right: -ARROW, boxShadow: `2px -2px 4px -1px ${shadowColor}` },
      };
    case "right-bottom":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { vertical: "bottom", horizontal: "right" },
        offset: { mr: 1.5 },
        arrowSx: { ...ARROW_BASE, bottom: 12, right: -ARROW, boxShadow: `2px -2px 4px -1px ${shadowColor}` },
      };
  }
}

const MenuPopover = ({ open, children, arrow = "right-top", disabledArrow = false, width, sx, ...other }: MenuPopoverProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const shadowColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const { anchorOrigin, transformOrigin, offset, arrowSx } = getPlacementConfig(arrow, shadowColor);
  // MUI applies a white overlay on dark mode papers at elevation 8 (Popover default).
  // Apply the same overlay to the arrow so it blends with the paper.
  const elevatedArrowSx = isDark
    ? { ...arrowSx, backgroundImage: 'linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.12))' }
    : arrowSx;

  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        paper: {
          sx: [
            {
              p: 1,
              overflow: "unset",
              ...(width && { width }),
              ...offset,
              ...(!disabledArrow && { "&::before": elevatedArrowSx }),
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ] as SxProps<Theme>,
        },
      }}
      {...other}
    >
      <MenuList disablePadding>{children}</MenuList>
    </Popover>
  );
};

/* ==================================================================================== */

export default MenuPopover;
