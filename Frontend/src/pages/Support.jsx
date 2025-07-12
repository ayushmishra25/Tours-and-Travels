// src/pages/Support.jsx
import React, { useState, useEffect } from 'react';
import DriverNavbar from '../components/DriverNavbar';
import axios from 'axios';
import { Helmet } from "react-helmet";

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError('');

    if (!subject.trim() || !message.trim()) {
      setFeedback('Both subject and message are required.');
      return;
    }

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
        setFeedback('Your request has been submitted. For the response please check the same page after sometime.');
        setSubject('');
        setMessage('');
        fetchSupportHistory(); // Refresh history after submission
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const fetchSupportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/api/supportdriver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = response.data;
      if (Array.isArray(data[0])) data = data[0];

      setHistory(data);
    } catch (err) {
      console.error('Error fetching support history:', err);
    }
  };

  useEffect(() => {
    fetchSupportHistory();
  }, []);

  return (
    <>
      <DriverNavbar />
      <div className="support-container">
        <h1>Driver Support</h1>
        <p>If you have any questions or issues, please fill out the form below and our support team will get back to you shortly.</p>
        <h4>OR</h4>
        <p style= {{color: '#004B8D'}}> Connect us for any driver support: +91 9310055869 </p>
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

        {/* Support History Section */}
        {history.length > 0 && (
          <div className="support-history">
            <h2>Previous Complaints & Resolutions</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.problem || item.message || "N/A"}</td>
                    <td>{item.resolution || "Admin will update this soon..."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Support;
