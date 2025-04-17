import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminNavbar from './components/AdminNavbar';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageDrivers from './pages/ManageDrivers';
import BookingManagement from './pages/BookingManagement';
import PaymentManagement from './pages/PaymentManagement';
import Reports from './pages/Reports';
import AdminSettings from './pages/AdminSettings';

import PrivateRoute from './utils/PrivateRoute';
import './AdminApp.css';

const AdminApp = () => {
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));

  return (
    <>
      {/* Show navbar only when authenticated */}
      {isAuthenticated && <AdminNavbar />}

      <Routes>
        {/* Public Admin Login */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="dashboard" element={<PrivateRoute component={<AdminDashboard />} />}/>
        <Route path="users" element={<PrivateRoute component={<ManageUsers />} />}/>
        <Route path="drivers"element={<PrivateRoute component={<ManageDrivers />} />}/>
        <Route path="bookings" element={<PrivateRoute component={<BookingManagement />} />} />
        <Route path="payments"element={<PrivateRoute component={<PaymentManagement />} />}/>
        <Route path="reports"element={<PrivateRoute component={<Reports />} />}/>
        <Route path="settings" element={<PrivateRoute component={<AdminSettings />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? 'dashboard' : 'login'} replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;
