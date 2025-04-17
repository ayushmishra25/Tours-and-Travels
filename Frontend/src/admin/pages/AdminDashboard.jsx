// src/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  // Dummy summary data
  const [summary, setSummary] = useState({
    totalUsers: 1200,
    totalDrivers: 350,
    totalBookings: 800,
    totalRevenue: 1000000,
    totalAdmins: 50,
  });

  useEffect(() => {
    // In a real app, fetch summary data via API
    // For now, dummy data is used.
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{summary.totalUsers}</p>
        </div>
        <div className="card">
          <h3>Total Drivers</h3>
          <p>{summary.totalDrivers}</p>
        </div>
        <div className="card">
          <h3>Total Bookings</h3>
          <p>{summary.totalBookings}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹ {summary.totalRevenue}</p>
        </div>
        <div className="card">
          <h3>Total Admins</h3>
          <p> {summary.totalAdmins}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
