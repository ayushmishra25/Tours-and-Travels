import React from 'react';
import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  const handleDriverServiceClick = () => {
    navigate('/dashboard');
    };

  return (
    
      <section className="services">
        <h1>Our Services</h1>
        <h2>Book Now Pay Later</h2>
        <div className="service-cards">
          <div className="service-card" onClick={handleDriverServiceClick} style={{ cursor: 'pointer' }}>
            <img src="/taxi_image.jpg" alt="Driver Services" />
            <h2>Driver Services</h2>
            <p>Hire professional drivers on a weekly, hourly, monthly, or daily basis.</p>
          </div>
          <div className="service-card">
            <img src="/cook_image.jpg" alt="Maid Services" />
            <h2>Maid & Cook Services</h2>
            <p>Find trusted maids and cooks to assist with household chores and meals.</p>
          </div>
        </div>
      </section>
    
  );
}

export default Services;

