 // src/admin/AdminApp.jsx
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
import ProtectedRoute from '../components/ProtectedRoute';
import './AdminApp.css';
import SupportComplaints from './pages/SupportComplaints';
import DriverDetails from './pages/Driverdetails';

const AdminApp = () => {
  return (
    <>
      {/* Navbar always visible */}
      <AdminNavbar />

      <Routes>
        {/* Public Admin Login */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers"
          element={
            <ProtectedRoute>
              <ManageDrivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="payments"
          element={
            <ProtectedRoute>
              <PaymentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="support-complaints"
          element={
            <ProtectedRoute>
              <SupportComplaints />
            </ProtectedRoute>
          }
        />

        <Route path="drivers/:id" element={<DriverDetails />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;