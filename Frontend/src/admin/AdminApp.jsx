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

import './AdminApp.css';
import SupportComplaints from './pages/SupportComplaints';

const AdminApp = () => {
  return (
    <>
      {/* Navbar always visible */}
      <AdminNavbar />

      <Routes>
        {/* Public Admin Login */}
        <Route path="login" element={<AdminLogin />} />

        {/* All admin pages now directly accessible */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="drivers" element={<ManageDrivers />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="support-complaints" element={<SupportComplaints />}/>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;

