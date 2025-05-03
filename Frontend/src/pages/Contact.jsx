// src/pages/Contact.jsx
import React from 'react';

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2>Get in Touch</h2>
        <p>We’d love to hear from you! Reach out via any of the channels below.</p>
        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <ul>
              <li><a href="mailto:sahyogforce@gmail.com">sahyogforce@gmail.com</a></li>
              <li><a href="mailto:contact@sahyogforce.com">contact@sahyogforce.com</a></li>
              <li><a href="mailto:support@sahyogforce.com">support@sahyogforce.com</a></li>
            </ul>
          </div>
          <div className="contact-item">
            <span className="contact-label">Phone:</span>
            <p>+91 88007 16535</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
