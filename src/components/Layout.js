import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop); // Open on desktop by default

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(isDesktop); // Re-evaluate when screen size changes
  }, [isDesktop]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const hideHeader = location.pathname === '/' || location.pathname === '/login';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideHeader && (
        <Header onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
      )}
      <Box display="flex" flex={1} pt={!hideHeader ? '64px' : 0}>
        {!hideHeader && (
          <Sidebar open={isSidebarOpen} onClose={closeSidebar} />
        )}
        <Box component="main" flex={1} p={hideHeader ? 0 : 3}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
