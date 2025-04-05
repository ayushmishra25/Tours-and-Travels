import React from "react";
import { useNavigate } from "react-router-dom";

const DriverSection = () => {
  const navigate = useNavigate();

  return (
    <div className="driver-section">
      <h1>Book a Driver</h1>
      <div className="driver-options">
        <div className="driver-card">
          <h2>Hourly Driver</h2>
          <p>Hire a driver on an hourly basis.</p>
          <button onClick={() => navigate("/hourly-driver")}>Book Now</button>
        </div>
        <div className="driver-card">
          <h2>Weekly Driver</h2>
          <p>Hire a driver for a whole week.</p>
          <button onClick={() => navigate("/weekly-driver")}>Book Now</button>
        </div>
        <div className="driver-card">
          <h2>Monthly Driver</h2>
          <p>Hire a driver for a month with ease.</p>
          <button onClick={() => navigate("/monthly-driver")}>Book Now</button>
        </div>
        <div className="driver-card">
          <h2>Ondemand Driver</h2>
          <p>Book a driver as per your need.</p>
          <button onClick={() => navigate("/ondemand-driver")}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default DriverSection;
