import React, { useState } from 'react';
import Header from './Header';
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

  const hideHeader = location.pathname === '/' || location.pathname === '/login';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideHeader && <Header onToggleSidebar={toggleSidebar} />}
      <Box display="flex" flex={1} pt={!hideHeader ? '64px' : 0}>
        {!hideHeader && <Sidebar open={isSidebarOpen} onClose={closeSidebar} />}
        <Box component="main" flex={1} p={hideHeader ? 0 : 3}>
          {children}
        </Box>
      </Box>

      {/* Footer removed */}
    </Box>
  );
};

export default Layout;
