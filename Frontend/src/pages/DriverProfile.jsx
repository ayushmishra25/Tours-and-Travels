import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios
import DriverNavbar from '../components/DriverNavbar';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ rides: 0, earnings: 0 });
  const [error, setError] = useState(''); // State to manage errors

  const driverId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  const token = localStorage.getItem('token'); // Assuming the auth token is stored in localStorage

  useEffect(() => {
    if (!driverId) {
      setError('Driver not authenticated');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${driverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        setUser(response.data.user);  // Set the user data from the API response
        
        // You can fetch stats here as well (replace with actual API if necessary)
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, [driverId, token]); // Add token to dependency array

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();  // Format the date in a readable format
  };

  return (
    <>
      <DriverNavbar />
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}
        
        <div className="profile-card">
          <div className="info-section">
            <h2>{user.name || 'Loading...'}</h2>
            <p><strong>Email:</strong> {user.email }</p>
            <p><strong>Phone:</strong> {user.phone }</p>
            <p><strong>Location:</strong> {user.location }</p>
            <p><strong>Joined:</strong> {user.created_at }</p>
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
