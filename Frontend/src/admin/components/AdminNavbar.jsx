import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <header className="admin-navbar">
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/users">User Management</Link></li>
          <li><Link to="/admin/drivers">Driver Management</Link></li>
          <li><Link to="/admin/bookings">Booking Management</Link></li>
          <li><Link to="/admin/payments">Payment Management</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminNavbar;
