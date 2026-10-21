import { useState } from "react";
import { NavLink } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import type { NavigationItem } from "@/common/types/navigation";

/* ===================================================================================================== */

const isAllowed = (item: NavigationItem, userRoles?: string[]): boolean => {
  if (item.hidden) return false;
  if (!item.roles || item.roles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return item.roles.some((r) => userRoles.includes(r));
};

export interface NavItemProps {
  item: NavigationItem;
  userRoles?: string[];
  collapsed: boolean;
  depth?: number;
}

const NavItem = ({ item, userRoles, collapsed, depth = 0 }: NavItemProps) => {
  const [open, setOpen] = useState(false);

  if (!isAllowed(item, userRoles)) return null;

  const hasChildren = !!item.children?.length;
  const indent = collapsed ? 0 : depth * 16;

  const buttonContent = (
    <>
      {item.icon && (
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 1.5,
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {item.icon}
        </ListItemIcon>
      )}
      {!collapsed && (
        <ListItemText
          primary={item.label}
          slotProps={{ primary: { variant: "body2", noWrap: true } }}
        />
      )}
      {!collapsed &&
        hasChildren &&
        (open ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        ))}
    </>
  );

  const sharedSx = {
    px: collapsed ? 0 : 1.5,
    py: 0.75,
    pl: collapsed ? 0 : `${16 + indent}px`,
    borderRadius: 1,
    mx: 0.5,
    mb: 1,
    justifyContent: collapsed ? "center" : "flex-start",
    "&.active": {
      bgcolor: "action.selected",
      color: "primary.main",
    },
    "&:hover": {
      bgcolor: "action.hover",
    },
  };

  if (hasChildren) {
    if (collapsed) {
      return (
        <>
          {item.children!.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              userRoles={userRoles}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </>
      );
    }

    return (
      <>
        <Tooltip title={item.label} placement="right" arrow disableInteractive>
          <ListItemButton onClick={() => setOpen((p) => !p)} sx={sharedSx}>
            {buttonContent}
          </ListItemButton>
        </Tooltip>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                userRoles={userRoles}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <Tooltip title={item.label} placement="right" arrow disableInteractive>
      <ListItemButton
        component={NavLink}
        to={item.path ?? "#"}
        end={item.path === "/"}
        sx={sharedSx}
      >
        {buttonContent}
      </ListItemButton>
    </Tooltip>
  );
};

/* ===================================================================================================== */

export default NavItem;
