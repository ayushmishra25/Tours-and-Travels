// src/admin/AdminApp.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageDrivers from "./pages/ManageDrivers";
import BookingManagement from "./pages/BookingManagement";
import PaymentManagement from "./pages/PaymentManagement";
import Reports from "./pages/Reports";
import AdminSettings from "./pages/AdminSettings";
import PrivateRoute from "./utils/PrivateRoute"; // Protected route

import "./AdminApp.css"; // Global Admin CSS

function AdminApp() {
  const isAuthenticated = localStorage.getItem("adminToken") !== null;
  return (
    <Router>
      {isAuthenticated && <AdminNavbar />}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<PrivateRoute component={<AdminDashboard />} />}
        />
        <Route
          path="/admin/users"
          element={<PrivateRoute component={<ManageUsers />} />}
        />
        <Route
          path="/admin/drivers"
          element={<PrivateRoute component={<ManageDrivers />} />}
        />
        <Route
          path="/admin/bookings"
          element={<PrivateRoute component={<BookingManagement />} />}
        />
        <Route
          path="/admin/payments"
          element={<PrivateRoute component={<PaymentManagement />} />}
        />
        <Route
          path="/admin/reports"
          element={<PrivateRoute component={<Reports />} />}
        />
        <Route
          path="/admin/settings"
          element={<PrivateRoute component={<AdminSettings />} />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default AdminApp;
