// src/pages/Support.jsx
import React, { useState } from 'react';
import DriverNavbar from '../components/DriverNavbar';
import axios from 'axios';
import { Helmet } from "react-helmet";

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError('');
  
    if (!subject.trim() || !message.trim()) {
      setFeedback('Both subject and message are required.');
      return;
    }

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${baseURL}/api/support`,
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 201) {
        setFeedback('Your request has been submitted. for the response please check the same page after sometime.');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };
  

  return (
    <>
      <DriverNavbar />
      <div className="support-container">
        <h1>Driver Support</h1>
        <p>If you have any questions or issues, please fill out the form below and our support team will get back to you shortly.</p>
        {feedback && <p className="feedback-message">{feedback}</p>}
        {error && <p className="error-message">{error}</p>}
        <form className="support-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail"
            />
          </div>
          <button type="submit" className="submit-btn">Send Request</button>
        </form>
      </div>
    </>
  );
};

export default Support;
