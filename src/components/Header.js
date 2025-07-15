
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onToggleSidebar }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1300 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onToggleSidebar} // sidebar toggle
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          React Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
