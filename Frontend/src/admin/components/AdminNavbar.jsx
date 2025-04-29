import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    
    <header className="admin-navbar">
      <h1>Admin Panel</h1>


      {/* Hamburger icon for mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {/* Navigation links */}
      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <ul>
          <li><Link to="/admin/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
          <li><Link to="/admin/users" onClick={toggleMenu}>User Management</Link></li>
          <li><Link to="/admin/drivers" onClick={toggleMenu}>Driver Management</Link></li>
          <li><Link to="/admin/bookings" onClick={toggleMenu}>Booking Management</Link></li>
          <li><Link to="/admin/payments" onClick={toggleMenu}>Payment Management</Link></li>
          <li><Link to="/admin/support-complaints" onClick={toggleMenu}>Support & Complaints</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminNavbar;
