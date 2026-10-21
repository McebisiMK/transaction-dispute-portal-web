import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { MyProfile, type MyProfileProps } from "../../my-profile";
import { Navbar } from "../../navbar";
import { ThemeToggle } from "@/theme";
import { NAV_ITEMS } from "@/common/constants/navigation";
import type { NavigationItem } from "@/common/types/navigation";

/* ============================================================================================ */

export interface SidebarContentProps {
  collapsed: boolean;
  profile: MyProfileProps;
  navItems?: NavigationItem[];
  userRoles?: string[];
}

const SidebarContent = ({ collapsed, profile, navItems, userRoles }: SidebarContentProps) => {
  const items = navItems ?? NAV_ITEMS;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {!collapsed && (
        <>
          <MyProfile {...profile} />
          <Divider />
        </>
      )}

      {collapsed && <Box sx={{ py: 1 }} />}

      <Navbar items={items} userRoles={userRoles} collapsed={collapsed} />

      <Divider />
      <Box sx={{ p: 1.5, display: "flex", justifyContent: "center" }}>
        <ThemeToggle iconOnly={collapsed} />
      </Box>
    </Box>
  );
};

/* ============================================================================================ */

export default SidebarContent;
