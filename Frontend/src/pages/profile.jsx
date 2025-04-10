import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = localStorage.getItem("userId"); // From login
  const token = localStorage.getItem("token");   // Auth token

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          setErrorMsg("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMsg("Failed to load profile. Please try again.");
      }
    };

    if (userId && token) {
      fetchProfile();
    } else {
      setErrorMsg("User not authenticated.");
    }
  }, [userId, token]);

  if (errorMsg) {
    return <div className="error-message">{errorMsg}</div>;
  }

  if (!userData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>Location:</strong> {userData.location}</p>
      <button>Edit Profile</button>
    </div>
  );
};

export default Profile;
