import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("adminToken"));

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `${baseURL}/api/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn("Server logout failed, proceeding with client cleanup");
    }

    // Clear admin session
    localStorage.removeItem("adminToken");
    // Navigate to admin login
    navigate("/login");
  };

  return (
    <header className="admin-navbar">
      <div className="logo-title">
        <img src="/logo.webp" alt="Sahyog Force Logo" className="navbar-logo" />
        <h1>ADMIN DASHBOARD</h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <ul>
          <li><Link to="/admin/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
          <li><Link to="/admin/users" onClick={toggleMenu}>User Management</Link></li>
          <li><Link to="/admin/drivers" onClick={toggleMenu}>Driver Management</Link></li>
          <li><Link to="/admin/bookings" onClick={toggleMenu}>Booking Management</Link></li>
          <li><Link to="/admin/payments" onClick={toggleMenu}>Payment Management</Link></li>
          <li><Link to="/admin/support-complaints" onClick={toggleMenu}>Support & Complaints</Link></li>

          {isLoggedIn && (
            <li>
              <Link to="#" onClick={() => { toggleMenu(); handleLogout(); }}>
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AdminNavbar;
