import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data && response.data.user) {
          setUserData(response.data.user);
          setFormData(response.data.user); // default form state
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${baseURL}/api/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setUserData(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleDiscard = () => {
    setFormData(userData);
    setEditing(false);
  };

  if (errorMsg) return <div className="error-message">{errorMsg}</div>;
  if (!userData) return <div>Loading profile...</div>;

  return (
    <div className="profile-container-user">
      <h2>User Profile</h2>

      {editing ? (
        <>
          <p>
            <strong>Name:</strong>
            <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
          </p>
          <p>
            <strong>Email:</strong>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} readOnly />
          </p>
          <p>
            <strong>Phone:</strong>
            <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} readOnly/>
          </p>
          <p>
            <strong>Location:</strong>
            <input type="text" name="location" value={formData.location || ""} onChange={handleChange} />
          </p>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleSave} className="save-btn-user">Save</button>
            <button onClick={handleDiscard} className="discard-btn-user" style={{ marginLeft: "1rem" }}>
              Discard
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <p><strong>Location:</strong> {userData.location}</p>
          <button onClick={() => setEditing(true)} className="edit-btn-user">Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
