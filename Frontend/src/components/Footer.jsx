import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>No.25 block b EXTN Bhagwati garden, near by dwarka</p>
          <p>mod metro station, uttam Nagar, New Delhi-110059</p>
          <p>Phone: +91 9220922268</p>
        </div>
        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-links">
              <a href="https://www.facebook.com/share/196oNQ1qkF/"  target="_blank" rel="noopener noreferrer"> <img src="facebook.jpg" alt="Facebook" /></a>
              <a href="https://twitter.com/YourHandle" target="_blank" rel="noopener noreferrer" > <img src="twitter.jpg" alt="Twitter" /></a>
              <a href="https://www.instagram.com/sahyogforce?igsh=cjY2bzQ3MzA0ZTI1"  target="_blank"  rel="noopener noreferrer" > <img src="instagram.jpg" alt="Instagram" /></a>
          </div>
          <p> contact@sahyogforce.com</p>
          <p> support@sahyogforce.com</p>
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
