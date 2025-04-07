import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!contact.trim() || contact.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit contact number.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/send-otp", {
        contact,
      });

      if (res.data.success) {
        setOtpSent(true);
        setErrorMsg("");
        alert("OTP sent successfully!");
      } else {
        setErrorMsg("Failed to send OTP.");
      }
    } catch (error) {
      setErrorMsg("Server error while sending OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
        contact,
        otp,
      });

      if (res.data.success) {
        alert("Login successful!");

        // Redirect based on user role
        if (res.data.role === "driver") {
          navigate("/driver-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setErrorMsg("Invalid OTP.");
      }
    } catch (error) {
      setErrorMsg("OTP verification failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-heading">Login</h2>
        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <form onSubmit={(e) => e.preventDefault()} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          {!otpSent && (
            <button type="button" className="login-btn" onClick={sendOtp}>
              Send OTP
            </button>
          )}

          {otpSent && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button type="button" className="login-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
