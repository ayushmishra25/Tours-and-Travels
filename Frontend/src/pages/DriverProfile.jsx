import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriverNavbar from '../components/DriverNavbar';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

  const driverId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (!driverId || !token) {
      setError('Driver not authenticated');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profile/${driverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, [driverId, token, baseURL]);

  return (
    <>
      <DriverNavbar />
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}
        <div className="profile-card">
          <div className="info-section">
            <h2>{user.name || 'Loading...'}</h2>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>Location:</strong> {user.location || 'N/A'}</p>
            <p><strong>Joined:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverProfile;
