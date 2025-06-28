import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!email.trim()) {
      setErrorMsg("Email field cannot be empty.");
      return false;
    }
    if (!emailPattern.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      setErrorMsg("Password field cannot be empty.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  
    try {
      const response = await axios.post(`${baseURL}/api/login`, {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("API response:", response.data);
  
      if (response.status === 200 && response.data.token) {
        const { token, user, role, redirect, detailsUploaded } = response.data;
  
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", role);
  
        const numericRole = parseInt(role, 10);
  
        // Log redirect information
        console.log("Navigating to:", redirect);
   
        // Redirect based on role
        if (numericRole === 1) {
          navigate("/driverjobdetails");
        } else if (numericRole === 2) {
          localStorage.setItem("adminToken", token);
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrorMsg(response.data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message || "Login failed. Please check your email or password."
      );
    }
  };
  
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-heading">Login</h2>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">Login</button>
          <a href="/forgot-password" style={{ marginTop:'10px', textDecoration: 'none', color:'red' }}>Forgot Password?</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
