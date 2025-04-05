import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Function to validate email and password
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
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Login Successful!");
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        setErrorMsg("Invalid login credentials.");
      }
    } catch (error) {
      setErrorMsg("Login failed. Please check your email or password.");
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
        </form>
      </div>
    </div>
  );
};

export default Login;
