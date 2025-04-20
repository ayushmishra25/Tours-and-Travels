import React, { useState } from "react";
import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  //clear auth and redirect to login
  const handleLogout = () => {
    // Remove authentication tokens and user data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    // Optionally, you can clear all storage: localStorage.clear();
    // 2. Close the mobile menu (optional)
    setIsOpen(false);
    // Redirect to login page
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
          <li>
            {/* ✅ Logout link that triggers handleLogout */}
            <Link to="#" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
