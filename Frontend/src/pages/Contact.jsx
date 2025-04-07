import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [responseMsg, setResponseMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle change for form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResponseMsg('');
    try {
      // Replace with your actual backend endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/contact', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.data.success) {
        setResponseMsg('Thank you for your message. We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg('There was an issue sending your message. Please try again later.');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="contact">
        <h2>Contact Us</h2>
        <p>If you have any complaints, queries, or need support, please fill out the form below.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            ></textarea>
          </div>
          <button type="submit" className="contact-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {responseMsg && <p className="response-msg">{responseMsg}</p>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </section>
    </div>
  );
}

export default Contact;
