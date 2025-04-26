// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, step }) => {
  const token    = localStorage.getItem('token');
  const role     = parseInt(localStorage.getItem('userRole'), 10);
  const registered    = localStorage.getItem('registered');
  const driverAgreed  = localStorage.getItem('driverAgreed');
  const driverUploaded = localStorage.getItem('driverUploaded');

  if (step === 'login') {
    if (!registered) {
      return <Navigate to="/register" replace />;
    }
    // If registered, show login (bypass token check)
    return children;
  }

  // ── STEP 2: PROTECT driverjobdetails (must be logged in + correct role) ──
  if (step === 'jobdetails') {
    if (!token || !allowedRoles?.includes(role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // ── STEP 3: PROTECT details-upload (must have agreed) ──
  if (step === 'upload') {
    if (!driverAgreed) {
      return <Navigate to="/driverjobdetails" replace />;
    }
    return children;
  }

  // ── STEP 4: PROTECT driver-dashboard (must have uploaded) ──
  if (step === 'dashboard') {
    if (!driverUploaded) {
      return <Navigate to="/driver-details-upload" replace />;
    }
    return children;
  }

  // ── ANY OTHER protected route: require token & role ──
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;