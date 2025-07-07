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
  const [myComplaints, setMyComplaints] = useState([]);

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/support`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        let data = response.data;
        if (Array.isArray(data[0])) data = data[0];

        const userId = localStorage.getItem('userId');
        const filtered = data.filter(c => `${c.driver_id}` === `${userId}`);
        setMyComplaints(filtered);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchMyComplaints();
  }, []);

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
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Support | Driver Panel</title>
      </Helmet>
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

        {/* Resolution Section */}
        <div className="resolution-section">
          <h2>Previous Complaints & Resolutions</h2>
          {myComplaints.length === 0 ? (
            <p className="no-complaint-msg">No previous complaints found.</p>
          ) : (
            <table className="resolution-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {myComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.problem || c.message || '-'}</td>
                    <td>{c.resolution || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Support;
