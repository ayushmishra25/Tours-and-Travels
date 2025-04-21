import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // ✅ New logout handler
  const handleLogout = () => {
    // Clear all stored auth/session data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminToken");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <h1>Dashboard</h1>
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      <nav className={isOpen ? "dashboard-nav open" : "dashboard-nav"}>
        <ul>
          <li>
            <Link to="/dashboard" onClick={toggleMenu}>Home</Link>
          </li>
          <li>
            <Link to="/dashboard/profile" onClick={toggleMenu}>User Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/bookings" onClick={toggleMenu}>My Bookings</Link>
          </li>
          {/* ★ Only show Logout when user is logged in */}
          {isLoggedIn && ( <li> <Link to="#" onClick={() => { toggleMenu(); handleLogout(); }}>  Logout </Link> </li>)}
        </ul>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
