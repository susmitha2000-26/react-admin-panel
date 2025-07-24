import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpOutlineIcon,
  ExpandLess,
  ExpandMore,
  GroupAdd as LeadsIcon,
  WorkOutline as OpportunityIcon,
  FollowTheSigns as FollowUpIcon,
  Share as SocialIcon,
  Close as CloseIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();
  const location = useLocation();
  const [openLeadsMenu, setOpenLeadsMenu] = useState(false);

  const handleLeadsClick = () => {
    setOpenLeadsMenu((prev) => !prev);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Call Logs', icon: <PhoneIcon />, path: '/calls' },
  ];

  const leadsSubmenu = [
    { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
    { text: 'Opportunity', icon: <OpportunityIcon />, path: '/leads/opportunity' },
    { text: 'Follow Up', icon: <FollowUpIcon />, path: '/leads/follow-up' },
    { text: 'Social Media Integration', icon: <SocialIcon />, path: '/leads/social' },
  ];

  return (
    <Drawer
      variant={isDesktop ? 'persistent' : 'temporary'}
      open={open}
      onClose={onClose}
      anchor="left" // Always on the left
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDesktop ? 'none' : theme.shadows[5],
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Toolbar />

      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          CRM
        </Typography>

        <IconButton onClick={onClose} size="small" aria-label="close sidebar">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Menu List */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (!isDesktop) onClose();
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Leads Expandable Menu */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLeadsClick}>
            <ListItemIcon>
              <LeadsIcon />
            </ListItemIcon>
            <ListItemText primary="Leads" />
            {openLeadsMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openLeadsMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {leadsSubmenu.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                      color: theme.palette.primary.main,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (!isDesktop) onClose();
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
