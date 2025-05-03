import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriverNavbar from '../components/DriverNavbar';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

  const driverId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!driverId || !token) {
      setError('Driver not authenticated');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        // If your response has a nested "data" field
        setUser(response.data);

      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, [driverId, token]);

  return (
    <>
      <DriverNavbar />
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}

        <div className="profile-card">
          <div className="info-section">
          <h2>{user?.name || 'Loading...'}</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Location:</strong> {user?.location}</p>
          <p><strong>Joined:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}</p>P
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
