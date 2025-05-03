// src/pages/DriverProfile.jsx
import React, { useEffect, useState } from 'react';
import DriverNavbar from '../components/DriverNavbar';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ rides: 0, earnings: 0 });

  useEffect(() => {
    // Load user from localStorage
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    // TODO: fetch stats from backend
    // Mock stats for now:
    setStats({ rides: 120, earnings: 45230 });
  }, []);

  return (
    <>
      <DriverNavbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="info-section">
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="stats-card">
          <button>Edit Profile</button>
        </div>
      </div>
    </>
  );
};

export default DriverProfile;