import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriverNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all relevant storage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('driverAgreed');
      localStorage.removeItem('driverUploaded');
      // Navigate back to login
      navigate('/login');
    }
  };

  return (
    <header className="driver-navbar">
      <h1>Driver Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/earnings">My Earnings</Link></li>
          <li><Link to="/trip-history">My Rides</Link></li>
          <li><Link to="/support">Support</Link></li>
          <li><Link to="/driver-profile">Driver Profile</Link></li>
          {token && (
            <li>
              <a href="#" onClick={handleLogout}>Logout</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default DriverNavbar;

