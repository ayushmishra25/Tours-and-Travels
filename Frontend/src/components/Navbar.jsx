import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      // For dashboard, check if location.pathname starts with /dashboard
      return location.pathname.startsWith('/dashboard');
    }
    return location.pathname === path;
  };

  return (
    <header className="driver-navbar">
      <div className="logo-title">
        <img src="/logo.webp" alt="Sahyog Force Logo" className="navbar-logo" />
        <h1>SAHYOG FORCE</h1>
      </div>

      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {/* Navigation Links */}
      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <ul>
          <li>
            <Link
              to="/"
              onClick={toggleMenu}
              className={isActive('/') ? 'active-link' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={toggleMenu}
              className={isActive('/about') ? 'active-link' : ''}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className={isActive('/contact') ? 'active-link' : ''}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/Blog"
              onClick={toggleMenu}
              className={isActive('/Blog') ? 'active-link' : ''}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              onClick={toggleMenu}
              className={isActive('/register') ? 'active-link' : ''}
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              onClick={toggleMenu}
              className={isActive('/login') ? 'active-link' : ''}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              onClick={toggleMenu}
              className={`book-now-btn ${isActive('/dashboard') ? 'active-link' : ''}`}
            >
              Book Now
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
