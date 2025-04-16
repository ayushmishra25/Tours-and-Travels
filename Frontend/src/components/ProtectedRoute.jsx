import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = parseInt(localStorage.getItem('userRole')); // assuming roles are stored as numbers

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
