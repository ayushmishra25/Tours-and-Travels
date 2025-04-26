// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, step }) => {
  const token    = localStorage.getItem('token');
  const role     = parseInt(localStorage.getItem('userRole'), 10);
  const registered    = localStorage.getItem('registered');
  const driverAgreed  = localStorage.getItem('driverAgreed');
  const driverUploaded = localStorage.getItem('driverUploaded');

  // 1️⃣ Registration → Login
  if (step === 'login' && !registered) {
    return <Navigate to="/register" replace />;
  }

  // 2️⃣ Login → JobDetails (must be logged in + role=driver)
  if (step === 'jobdetails') {
    if (!token || allowedRoles?.length === 0 || !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }

  // 3️⃣ JobDetails → Upload
  if (step === 'upload' && !driverAgreed) {
    return <Navigate to="/driverjobdetails" replace />;
  }

  // 4️⃣ Upload → Dashboard
  if (step === 'dashboard' && !driverUploaded) {
    return <Navigate to="/driver-details-upload" replace />;
  }

  // Fallback role check for any other protected route
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
