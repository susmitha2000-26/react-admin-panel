import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader = location.pathname === '/' || location.pathname === '/login';

  useEffect(() => {
    setSidebarOpen(isDesktop); // auto-toggle when screen size changes
  }, [isDesktop]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (!isDesktop) setSidebarOpen(false); // only close on mobile
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      {!hideHeader && (
        <Header onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
      )}

      {/* Body Section */}
      <Box display="flex" flex={1} pt={!hideHeader ? '64px' : 0}>
        {/* Sidebar */}
        {!hideHeader && (
          <Sidebar open={isSidebarOpen} onClose={closeSidebar} />
        )}

        {/* Main Content Area */}
        <Box
          component="main"
          flex={1}
          p={{ xs: 2, sm: 3 }}
          sx={{
            transition: 'margin-left 0.3s ease',
            ml: !hideHeader && isDesktop && isSidebarOpen ? `${drawerWidth}px` : 0,
            backgroundColor: theme.palette.background.default,
            minHeight: 'calc(100vh - 64px)',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
