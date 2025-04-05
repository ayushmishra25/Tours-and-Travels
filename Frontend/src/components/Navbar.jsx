import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <h1>SAHYOG FORCE</h1>
      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      
      {/* Navigation Links */}
      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
          <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;

