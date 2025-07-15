
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

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header onToggleSidebar={toggleSidebar} />
      <Box display="flex" flex={1} pt="64px">
        <Sidebar open={isSidebarOpen} onClose={closeSidebar} />
        <Box component="main" flex={1} p={3}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
