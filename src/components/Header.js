import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function Header({ onToggleSidebar, onLogout }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>

        {/* Left: Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Middle: Logo/Title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          CRM
        </Typography>

        {/* Right: Logout Icon */}
        <Tooltip title="Logout">
          <IconButton
            color="inherit"
            onClick={() => {
              console.log('Logout clicked'); // Confirm click is working
              if (onLogout) onLogout();       // Call the passed-in handler
            }}
          >
            <PowerSettingsNewIcon />
          </IconButton>
        </Tooltip>

      </Toolbar>
    </AppBar>
  );
}
