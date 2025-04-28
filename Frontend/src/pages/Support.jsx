// src/pages/Support.jsx
import React, { useState } from 'react';
import DriverNavbar from '../components/DriverNavbar';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFeedback('Both subject and message are required.');
      return;
    }
    // TODO: send to backend
    setFeedback('Your request has been submitted. Our support team will contact you soon.');
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <DriverNavbar />
      <div className="support-container">
        <h1>Driver Support</h1>
        <p>If you have any questions or issues, please fill out the form below and our support team will get back to you shortly.</p>
        {feedback && <p className="feedback-message">{feedback}</p>}
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