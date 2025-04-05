import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>Email: sahyogforce@gmail.com</p>
          <p>Phone: +91 9220922268</p>
        </div>
        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-links">
            <img src="/facebook.jpg" alt="Facebook" />
            <img src="/twitter.jpg" alt="Twitter" />
            <img src="/instagram.jpg" alt="Instagram" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Sahyog Force. All rights reserved.</p>
        <p><Link to="/terms-and-conditions" className="terms-link">Terms & Conditions</Link></p>
      </div>
    </footer>
  );
}

export default Footer;
