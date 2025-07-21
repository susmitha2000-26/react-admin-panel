import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout & Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ContactSupport from './components/ContactSupport';
import NotFound from './pages/NotFound'; // Create this page for 404 handling

// Admin
import UserManagementPage from './pages/UserManagementPage';

// Leads-related
import Leads from './leads/Leads';
import LeadForm from './leads/LeadForm';
import Opportunity from './leads/Opportunity';
import OpportunityForm from './leads/OpportunityForm';

import FollowUp from './leads/FollowUp';
import CreateFollowUpPage from './leads/CreateFollowUpPage';
import SocialIntegration from './leads/SocialIntegration';
// Call Logs
import CallLogs from './calls/CallLogs';
import CallLogForm from './calls/CallLogForm';
import CallAnalytics from './calls/CallAnalytics';

const AppRoutes = () => {
  return (
    <Routes>

      {/* Auth / Entry */}
      <Route path="/" element={<Login />} /> {/* ⬅ Public entry page */}
      <Route path="/login" element={<Login />} /> {/* ⬅ Explicit login route */}

      {/* Main App with Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />

      {/* Help & Support */}
      <Route path="/help" element={<Layout><Help /></Layout>} />
      <Route path="/contact-support" element={<Layout><ContactSupport /></Layout>} />

      {/* Admin */}
      <Route path="/admin/users" element={<Layout><UserManagementPage /></Layout>} />

      {/* Leads */}
      <Route path="/leads" element={<Layout><Leads /></Layout>} />
      <Route path="/leads/create" element={<Layout><LeadForm /></Layout>} />
      <Route path="/leads/edit/:id" element={<Layout><LeadForm /></Layout>} />
      <Route path="/leads/opportunity" element={<Layout><Opportunity /></Layout>} />
      <Route path="/leads/opportunity/create" element={<Layout><OpportunityForm /></Layout>} />
      <Route path="/leads/opportunity/edit/:id" element={<Layout><OpportunityForm /></Layout>} />
      <Route path="/leads/follow-up" element={<Layout><FollowUp /></Layout>} />
      <Route path="/leads/follow-up/new" element={<Layout><CreateFollowUpPage /></Layout>} />
      <Route path="/leads/follow-up/edit/:id" element={<Layout><CreateFollowUpPage /></Layout>} />
      <Route path="/leads/social" element={<Layout><SocialIntegration /></Layout>} />

      <Route path="/calls" element={<Layout><CallLogs /></Layout>} />
      <Route path="/calls/create" element={<Layout><CallLogForm /></Layout>} />
      <Route path="/calls/edit/:id" element={<Layout><CallLogForm /></Layout>} />
      <Route path="/calls/analytics" element={<Layout><CallAnalytics /></Layout>} />

      
       {/* 404 Page */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;
