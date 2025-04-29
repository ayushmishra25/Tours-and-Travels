import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const toggleMenu = () => setIsOpen(!isOpen);

  // ✅ Dynamic logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn("Server logout failed, proceeding with client-side cleanup");
    }

    // Clear session data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminToken");

    // Redirect to login
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div className="logo-title">
        <img src="logo.jpg" alt="Sahyog Force Logo" className="navbar-logo" />
        <h1>USER DASHBOARD</h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <nav className={isOpen ? "dashboard-nav open" : "dashboard-nav"}>
        <ul>
          <li><Link to="/dashboard" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/dashboard/profile" onClick={toggleMenu}>User Profile</Link></li>
          <li><Link to="/dashboard/bookings" onClick={toggleMenu}>My Bookings</Link></li>

          {isLoggedIn && (
            <li>
              {/* styled like other links, not a button */}
              <Link to="#" onClick={() => { toggleMenu(); handleLogout(); }}>  Logout</Link>
              </li>
            )
          }
        </ul>
      </nav>
    </header>
  );
};

export default DashboardNavbar;