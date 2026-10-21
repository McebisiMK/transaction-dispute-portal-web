import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { NavItem } from "./nav-item";
import type { NavigationItem } from "@/common/types/navigation";

/* ===================================================================================================== */

export interface NavbarProps {
  items: NavigationItem[];
  userRoles?: string[];
  collapsed?: boolean;
}

const Navbar = ({ items, userRoles, collapsed = false }: NavbarProps) => {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
      <List disablePadding>
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            userRoles={userRoles}
            collapsed={collapsed}
          />
        ))}
      </List>
    </Box>
  );
};

/* ===================================================================================================== */

export default Navbar;
