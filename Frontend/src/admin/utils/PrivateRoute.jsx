// src/admin/utils/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component }) => {
  const token = localStorage.getItem("adminToken");
  return token ? component : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
