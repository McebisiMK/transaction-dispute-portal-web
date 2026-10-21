import { useState, type ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { CONFIG } from '@/config-global';
import { MenuPopover } from '@/common/components/menu-popover';

/* ============================================================================================ */

export interface TopbarProps {
  onMenuToggle:   () => void;
  sidebarOpen?:   boolean;
  title?:         string;
  userName?:      string;
  userAvatarUrl?: string;
  userEmail?:     string;
  actions?:       ReactNode;
  onLogout?:      () => void;
}

const getInitials = (name?: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const Topbar = ({ onMenuToggle, sidebarOpen = true, title = CONFIG.appName, userName, userAvatarUrl, userEmail, actions, onLogout, }: TopbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor:      'background.paper',
        borderBottom: '1px solid',
        borderColor:  'divider',
        color:        'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>

        <IconButton
          edge="start"
          onClick={onMenuToggle}
          aria-label="toggle sidebar"
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Box sx={{ position: 'relative', width: 24, height: 24 }}>
            <MenuIcon
              sx={{
                position:   'absolute',
                inset:      0,
                transition: 'opacity 0.2s ease, transform 0.25s ease',
                opacity:    sidebarOpen ? 0 : 1,
                transform:  sidebarOpen ? 'rotate(45deg) scale(0.7)' : 'rotate(0deg) scale(1)',
              }}
            />
            <MenuOpenIcon
              sx={{
                position:   'absolute',
                inset:      0,
                transition: 'opacity 0.2s ease, transform 0.25s ease',
                opacity:    sidebarOpen ? 1 : 0,
                transform:  sidebarOpen ? 'rotate(0deg) scale(1)' : 'rotate(-45deg) scale(0.7)',
              }}
            />
          </Box>
        </IconButton>

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight:    800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color:         'primary.main',
            flex:          1,
            ml:            0.5,
          }}
        >
          {title}
        </Typography>

        {actions}

        <Avatar
          src={userAvatarUrl}
          alt={userName}
          sx={{
            width:      34,
            height:     34,
            bgcolor:    'primary.main',
            fontSize:   '0.8rem',
            fontWeight: 700,
            cursor:     'pointer',
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {!userAvatarUrl && getInitials(userName)}
        </Avatar>

        <MenuPopover open={anchorEl} onClose={() => setAnchorEl(null)} arrow="top-right" width={220}>
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography variant="subtitle2" noWrap>{userName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="p">{userEmail}</Typography>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onLogout?.();
            }}
            sx={{ color: 'error.main', gap: 1 }}
          >
            <LogoutIcon fontSize="small" />
            Sign out
          </MenuItem>
        </MenuPopover>

      </Toolbar>
    </AppBar>
  );
};

/* ============================================================================================ */

export default Topbar;
