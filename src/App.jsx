import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { SessionProvider } from './context/SessionContext';
import { AdminProvider } from './context/AdminContext';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

import Loader from './components/Loader';

// Lazy-loaded Public/User Pages
const InviteGate = lazy(() => import('./pages/InviteGate'));
const Portal = lazy(() => import('./pages/Portal'));
const Listings = lazy(() => import('./pages/Listings'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageListings = lazy(() => import('./pages/admin/ManageListings'));
const ListingForm = lazy(() => import('./pages/admin/ListingForm'));
const InviteCodes = lazy(() => import('./pages/admin/InviteCodes'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const InviteRequests = lazy(() => import('./pages/admin/InviteRequests'));

function App() {
  return (
    <Router>
      <AdminProvider>
        <SessionProvider>
          <Suspense fallback={<Loader />}>
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
                <Route path="invite-requests" element={<InviteRequests />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </SessionProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
