import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>No.25 Block B Extn, Near By Dwarka Mod Metro Station,</p>
          <p>uttam Nagar, New Delhi-110059</p>
          <p>Driver Support: +91 9310055869 </p>
          <p>Cusomer Support: +91 9220922268 </p>
        </div>
        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61575965612981"  target="_blank" rel="noopener noreferrer"> <img src="/facebook.webp" alt="Facebook" /></a>
              <a href="https://x.com/sahyogforce" target="_blank" rel="noopener noreferrer" > <img src="/twitter.webp" alt="Twitter" /></a>
              <a href="https://www.instagram.com/sahyogforce?igsh=cjY2bzQ3MzA0ZTI1"  target="_blank"  rel="noopener noreferrer" > <img src="/instagram.webp" alt="Instagram" /></a>
          </div>
          <p><a href="mailto:contact@sahyogforce.com">contact@sahyogforce.com</a></p>
          <p><a href="mailto:support@sahyogforce.com">support@sahyogforce.com</a></p>
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
