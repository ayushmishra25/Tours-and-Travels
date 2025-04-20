// src/admin/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy check – in production, call your admin login API
    if (email === "admin@company.com" && password === "admin123") {
      // localStorage.setItem("adminToken", "dummyAdminToken");
      /* navigate("/admin/dashboard"); */
    } else {
      setErrorMsg("Invalid admin credentials.");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      console.log("admin login....");
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-login-btn">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
