import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ IMPORT ADDED

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate(); // ✅ HOOK INITIALIZED

  const handleSendOtp = async () => {
    setMessage('sending otp....')
    console.log('Sending OTP to:', email);
    console.log('POST →', `${baseURL}/api/send-otp`);
    console.log('Payload:', { email });

    try {
      const res = await axios.post(
        `${baseURL}/api/send-otp`,
        { email }
      );
      console.log('Send OTP response:', res.status, res.data);

      if (res.data.success) {
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        setOtpSent(true); // Ensures OTP section opens even on fallback message
        setMessage('OTP sent to respective email');
      }
    } catch (error) {
      console.error('Send OTP error:', error.response || error.message);
      setMessage(
        error.response?.data?.message ||
        `Error ${error.response?.status || ''}: Failed to send OTP.`
      );
    }
  };

  const handleVerifyOtp = async () => {
    console.log('Verifying OTP:', otp);
    console.log('POST →', `${baseURL}/api/verify-otp`);
    console.log('Payload:', { email, otp });

    try {
      const res = await axios.post(
        `${baseURL}/api/verify-otp`,
        { email, otp }
      );
      console.log('Verify OTP response:', res.status, res.data);

      if (res.data.message === 'OTP verified successfully') {
        setOtpVerified(true);
        setMessage('OTP verified successfully. Please reset your password.');
      } else {
        setMessage(res.data.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error.response || error.message);
      setMessage(
        error.response?.data?.message ||
        `Error ${error.response?.status || ''}: OTP verification failed.`
      );
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    console.log('Resetting password for:', email);
    console.log('POST →', `${baseURL}/api/reset-password`);
    console.log('Payload:', { email, otp, password, password_confirmation: confirmPassword });

    try {
      const res = await axios.post(
        `${baseURL}/api/reset-password`,
        {
          email,
          otp,
          password,
          password_confirmation: confirmPassword, // ✅ fixed key name
        }
      );
      console.log('Reset password response:', res.status, res.data);

      if (res.data.message === "Password reset successful") {
        setMessage('Password reset successful. You can now log in.');
        setTimeout(() => navigate('/login'), 2000); // ✅ REDIRECT ADDED
      } else {
        setMessage(res.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset Password error:', error.response || error.message);
      setMessage(
        error.response?.data?.message ||
        `Error ${error.response?.status || ''}: Server error while resetting password.`
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="message">{message}</p>}

      {!otpSent && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          <h6>This otp is valid for 5 minutes only.</h6>
        </>
      )}

      {otpVerified && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Set New Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
