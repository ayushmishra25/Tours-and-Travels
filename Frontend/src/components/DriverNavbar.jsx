import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriverNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${baseURL}/api/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('driverAgreed');
      localStorage.removeItem('driverUploaded');
      navigate('/login');
    }
  };

  return (
    <header className="driver-navbar">
       <div className="logo-title">
        <img src="logo.webp" alt="Sahyog Force Logo" className="navbar-logo" />
        <h1>DRIVER DASHBOARD</h1>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      <nav className={isOpen ? 'nav-menu open' : 'nav-menu'}>
        <ul>
          <li><Link to="/driver-dashboard" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/trip-history" onClick={toggleMenu}>My Rides</Link></li>
          <li><Link to="/support" onClick={toggleMenu}>Support</Link></li>
          <li><Link to="/driver-profile" onClick={toggleMenu}>Driver Profile</Link></li>
          {token && (
            <li>
              <a href="#" onClick={(e) => { toggleMenu(); handleLogout(e); }}>
                Logout
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default DriverNavbar;
