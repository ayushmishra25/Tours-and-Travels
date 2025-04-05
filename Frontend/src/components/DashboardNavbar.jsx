import React, { useState } from "react";
import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
            <Link to="/" onClick={toggleMenu}>Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
