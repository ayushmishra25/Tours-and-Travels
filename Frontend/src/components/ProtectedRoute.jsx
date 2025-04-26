import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = parseInt(localStorage.getItem('userRole')); // assuming roles are stored as numbers
  const reg      = localStorage.getItem('registered');
  const agreed   = localStorage.getItem('driverAgreed');
  const uploaded = localStorage.getItem('driverUploaded');
  

  // 1. Registration → Login
  if (step === 'login' && !reg) {
    return <Navigate to="/register" replace />;
  }

  // 2. Login → Job Details
  if (step === 'jobdetails') {
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }
  // 3. Job Details → Upload
  if (step === 'upload' && !agreed) {
    return <Navigate to="/driverjobdetails" replace />;
  }

  // 4. Upload → Dashboard
  if (step === 'dashboard' && !uploaded) {
    return <Navigate to="/driver-details-upload" replace />;
  }

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but role not allowed
    return <Navigate to="/login" replace />;
  }

  // Logged in and role is allowed
  return children;
};

export default ProtectedRoute;
