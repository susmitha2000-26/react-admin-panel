import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Leads from './leads/Leads';
import Opportunity from './leads/Opportunity';
import FollowUp from './leads/FollowUp';
import SocialIntegration from './leads/SocialIntegration';
import UserManagementPage from './pages/UserManagementPage';

import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Login /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="/help" element={<Layout><Help /></Layout>} />
      <Route path="/admin/users" element={<UserManagementPage />} />


      {/* Wrap leads pages in Layout */}
      <Route path="/leads" element={<Layout><Leads /></Layout>} />
      <Route path="/leads/opportunity" element={<Layout><Opportunity /></Layout>} />
      <Route path="/leads/follow-up" element={<Layout><FollowUp /></Layout>} />
      <Route path="/leads/social" element={<Layout><SocialIntegration /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;
