import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>No.25 Block B Extn, Near By Dwarka Mod Metro Station,</p>
          <p>Uttam Nagar, New Delhi-110059</p>
          <p>Driver Support: +91 9310055869 </p>
          <p>Customer Support: +91 9220922268 </p>
        </div>

        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61575965612981" target="_blank" rel="noopener noreferrer">
              <img src="/facebook.webp" alt="Facebook" />
            </a>
            <a href="https://x.com/sahyogforce" target="_blank" rel="noopener noreferrer">
              <img src="/twitter.webp" alt="Twitter" />
            </a>
            <a href="https://www.instagram.com/sahyogforce?igsh=cjY2bzQ3MzA0ZTI1" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.webp" alt="Instagram" />
            </a>
          </div>
          <p><a href="mailto:contact@sahyogforce.com">contact@sahyogforce.com</a></p>
          <p><a href="mailto:support@sahyogforce.com">support@sahyogforce.com</a></p>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/dashboard">Book Now</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Services</h2>
          <ul className="footer-links">
            <li><Link to="/hourly-driver">Hourly Driver </Link></li>
            <li><Link to="/weekly-driver">Weekly Driver</Link></li>
            <li><Link to="/monthly-driver">Monthly Driver</Link></li>
            <li><Link to="/ondemand-driver">On-Demand Driver</Link></li>
            <li><Link to="/hourly-driver">Event Driver Driver</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Cities We Serve</h2>
          <ul className="footer-links">
            <li>Noida</li>
            <li>Delhi</li>
            <li>Ghaziabad</li>
            <li>Faridabad</li>
            <li>Gurugram</li>
            <li>Greater Noida</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 Sahyog Force. All rights reserved.</p>
        <p><Link to="/terms-and-conditions" className="terms-link">Terms & Conditions</Link></p>
        <p><Link to="/privacy-and-policy" className="terms-link">Privacy & Policy</Link></p>
      </div>
    </footer>
  );
}

export default Footer;
