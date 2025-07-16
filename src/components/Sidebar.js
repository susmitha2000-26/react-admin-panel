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
} from '@mui/material';
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
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLeadsMenu, setOpenLeadsMenu] = useState(false);

  const handleLeadsClick = () => {
    setOpenLeadsMenu(!openLeadsMenu);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
  ];

  const leadsSubmenu = [
    { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
    { text: 'Opportunity', icon: <OpportunityIcon />, path: '/leads/opportunity' },
    { text: 'Follow Up', icon: <FollowUpIcon />, path: '/leads/follow-up' },
    { text: 'Social Media Integration', icon: <SocialIcon />, path: '/leads/social' },
  ];

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { width: 240 },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Leads Menu */}
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
                  sx={{ pl: 4 }}
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
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
