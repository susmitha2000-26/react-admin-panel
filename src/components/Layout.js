import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // List of routes where Header/Footer should be hidden
  const hideHeaderFooter = location.pathname === '/' || location.pathname === '/login';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideHeaderFooter && <Header onToggleSidebar={toggleSidebar} />}
      <Box display="flex" flex={1} pt={!hideHeaderFooter ? '64px' : 0}>
        {!hideHeaderFooter && <Sidebar open={isSidebarOpen} onClose={closeSidebar} />}
        <Box component="main" flex={1} p={hideHeaderFooter ? 0 : 3}>
          {children}
        </Box>
      </Box>
      {!hideHeaderFooter && <Footer />}
    </Box>
  );
};

export default Layout;
