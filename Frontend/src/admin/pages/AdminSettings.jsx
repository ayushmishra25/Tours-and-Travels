// src/admin/pages/AdminSettings.jsx
import React, { useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    adminName: "Admin Name",
    email: "admin@company.com",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings updated successfully (dummy)!");
  };

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>Admin Name:</label>
          <input
            type="text"
            name="adminName"
            value={settings.adminName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={settings.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="settings-submit-btn">Update Settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
