import { useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/common/auth/useAuth";
import { useLookups } from "@/common/lookups";
import { Topbar } from "../topbar";
import { Sidebar } from "../sidebar";
import type { NavigationItem } from "@/common/types/navigation";
import type { MyProfileProps } from "../my-profile";

/* ===================================================================================================== */

export interface AppLayoutProps {
  navItems?: NavigationItem[];
  userRoles?: string[];
  profile?: MyProfileProps;
  title?: string;
  topBarActions?: ReactNode;
}

const AppLayout = ({ navItems, userRoles, profile: profileProp, title, topBarActions, }: AppLayoutProps) => {
  const { account, roles, logout } = useAuth();
  useLookups();
  const profile = profileProp ?? {
    name:  account?.name ?? '',
    email: account?.email ?? '',
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Topbar
        onMenuToggle={handleMenuToggle}
        sidebarOpen={isMobile ? mobileOpen : !collapsed}
        title={title}
        userName={profile.name}
        userAvatarUrl={profile.avatarUrl}
        userEmail={profile.email}
        actions={topBarActions}
        onLogout={logout}
      />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          profile={profile}
          navItems={navItems}
          userRoles={userRoles ?? roles}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            bgcolor: "background.default",
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

/* ===================================================================================================== */

export default AppLayout;
