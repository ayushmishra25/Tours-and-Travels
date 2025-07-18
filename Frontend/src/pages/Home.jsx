import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Services from './Services';
import HowToUse from '../components/HowToUse';
import CustomerReview from './CustomerReview'; // adjust path if needed
import RatingsAndFaqs from './RatingsAndFaqs';
import { Helmet } from "react-helmet";

function Home() {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    if (!serviceType) {
      alert("Please select a service type.");
      return;
    }

    let path = '/';
    switch (serviceType) {
      case 'hourly':
        path = '/hourly-driver';
        break;
      case 'weekly':
        path = '/weekly-driver';
        break;
      case 'monthly':
        path = '/monthly-driver';
        break;
      case 'ondemand':
        path = '/ondemand-driver';
        break;
      case 'event':
        path = '/hourly-driver'; // event treated same as hourly
        break;
      default:
        path = '/';
    }

    navigate(path);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Hire Professional Drivers | Hourly, Daily & Monthly - Sahyog Force</title>
        <meta
          name="description"
          content="Hire trained, verified drivers on hourly, daily, weekly, or monthly basis with Sahyog Force. Book drivers on-demand with GST billing and professional service."
        />
        <meta
          name="keywords"
          content="driver hire India, hourly driver booking, monthly drivers, on-demand drivers, Sahyog Force, professional drivers, driver services, book drivers online, driver with GST bill"
        />
        <meta name="author" content="Sahyog Force Team" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Hire Professional Drivers | Hourly, Daily & Monthly - Sahyog Force" />
        <meta property="og:description" content="Reliable and verified drivers available on hourly, daily, and monthly plans. Book with Sahyog Force and get GST-compliant billing." />
        <meta property="og:url" content="https://www.sahyogforce.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.sahyogforce.com/logo.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hire Professional Drivers | Sahyog Force" />
        <meta name="twitter:description" content="Book trained and verified drivers for personal or business needs. GST invoice provided. Trusted by thousands." />
        <meta name="twitter:image" content="/twitter.webp" />
      </Helmet>

      {/* Fullscreen Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>"Driven by trust powered by professionalism."</h1>
            <p>Book Hourly, Daily, or Monthly drivers easily with Sahyog Force.</p>
          </div>

          <form className="booking-form-home" onSubmit={handleBooking}>
            <h2>Book Now Pay Later </h2>
            <select
              name="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="">Select Service</option>
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="ondemand">On Demand</option>
              <option value="event">Event</option>
            </select>
            <button type="submit">Book Now</button>
          </form>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* How to Use Section */}
      <HowToUse />

      {/* Customer Reviews Section */}
      <CustomerReview />

      <RatingsAndFaqs />
    </>
  );
}

export default Home;
