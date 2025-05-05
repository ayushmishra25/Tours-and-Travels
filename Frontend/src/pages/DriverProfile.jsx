import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriverNavbar from '../components/DriverNavbar';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ rides: 0, earnings: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // ✅ ADD THIS LINE

  const driverId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!driverId) {
      setError('Driver not authenticated');
      setLoading(false); // ✅ stop loading
      return;
    }

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profile/${driverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setStats(response.data.stats || { rides: 0, earnings: 0 });
        setError(''); // ✅ Clear previous error
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false); // ✅ Always stop loading
      }
    };

    fetchProfileData();
  }, [driverId, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <DriverNavbar />
      <div className="profile-container">
        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="profile-card">
            <div className="info-section">
              <h2>{user.name}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <p><strong>Joined:</strong> {formatDate(user.created_at)}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DriverProfile;
