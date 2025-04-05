import React from 'react';
import { Link } from 'react-router-dom';

const DriverNavbar = () => {
  return (
    <header className="driver-navbar">
      <h1>Driver Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/earnings">My Earnings</Link></li>
          <li><Link to="/trip-history">My Rides</Link></li>
          <li><Link to="/support">Support</Link></li>
          <li><Link to="/driver-profile">Driver Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default DriverNavbar;
