import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { SessionProvider } from './context/SessionContext';
import { AdminProvider } from './context/AdminContext';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

// Public/User Pages
import InviteGate from './pages/InviteGate';
import Portal from './pages/Portal';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageListings from './pages/admin/ManageListings';
import ListingForm from './pages/admin/ListingForm';
import InviteCodes from './pages/admin/InviteCodes';
import Inquiries from './pages/admin/Inquiries';

function App() {
  return (
    <Router>
      <AdminProvider>
        <SessionProvider>
          <Routes>
            {/* Public Entry */}
            <Route path="/" element={<InviteGate />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected User Portal Routes */}
            <Route path="/portal" element={<ProtectedRoute />}>
              <Route index element={<Portal />} />
              <Route path="listings" element={<Listings />} />
              <Route path="listings/:id" element={<ListingDetail />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="listings" element={<ManageListings />} />
              <Route path="listings/new" element={<ListingForm />} />
              <Route path="listings/:id/edit" element={<ListingForm />} />
              <Route path="invite-codes" element={<InviteCodes />} />
              <Route path="inquiries" element={<Inquiries />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SessionProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
