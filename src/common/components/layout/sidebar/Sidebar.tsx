import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { SidebarContent } from "./sidebar-content";
import type { MyProfileProps } from "../my-profile";
import type { NavigationItem } from "@/common/types/navigation";

/* ============================================================================================ */

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 64;

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  profile: MyProfileProps;
  navItems?: NavigationItem[];
  userRoles?: string[];
}

const Sidebar = ({ open, onClose, collapsed, profile, navItems, userRoles }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: "none",
            boxShadow: 3,
          },
        }}
      >
        <SidebarContent
          collapsed={false}
          profile={profile}
          navItems={navItems}
          userRoles={userRoles}
        />
      </Drawer>
    );
  }

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box
      component="aside"
      sx={{
        width,
        flexShrink: 0,
        height: "100%",
        borderRight: "1px solid",
        borderColor: "divider",
        transition: "width 0.25s ease",
        overflow: "hidden",
      }}
    >
      <SidebarContent
        collapsed={collapsed}
        profile={profile}
        navItems={navItems}
        userRoles={userRoles}
      />
    </Box>
  );
};

/* ============================================================================================ */

export { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
export default Sidebar;
