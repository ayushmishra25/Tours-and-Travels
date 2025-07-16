import React from 'react';
import { Helmet } from "react-helmet";
import { FaCar, FaClock, FaCalendarWeek, FaRoute, FaGlassCheers } from 'react-icons/fa';

const driverServices = [
  {
    icon: <FaCar size={40} color="#002855" />,
    title: "Permanent / Monthly Driver",
    description: `Experience the ultimate convenience with a dedicated, professional chauffeur at your service for an entire month or longer. Ideal for busy executives, families, or individuals seeking consistent, reliable transport. Eliminates HR hassles, and we handle driver replacements.`,
  },
  {
    icon: <FaCalendarWeek size={40} color="#002855" />,
    title: "Weekly Driver",
    description: `Need consistent support on specific days? Our weekly driver service provides flexibility between hourly and monthly commitments. Ideal for fixed commutes and regular appointments.`,
  },
  {
    icon: <FaClock size={40} color="#002855" />,
    title: "Hourly Driver",
    description: `Hire a professional driver for a few hours. Perfect for errands, quick trips, or spontaneous outings. Pay only for the time you need.`,
  },
  {
    icon: <FaRoute size={40} color="#002855" />,
    title: "Outstation Driver",
    description: `Planning a trip outside Delhi NCR? Our expert drivers ensure a smooth, safe, and transparent journey in your own vehicle.`,
  },
  {
    icon: <FaGlassCheers size={40} color="#002855" />,
    title: "Event Driver",
    description: `Hire a discreet and punctual chauffeur for weddings, parties, or corporate events. Arrive in style and leave the driving to us.`,
  },
];

function Services() {
  return (
    <section className="services">
      <Helmet>
        <title>Driver Services - Sahyog Force</title>
      </Helmet>

      <h1>Our Driver Services</h1>
      <div className="service-cards">
        {driverServices.map((service, index) => (
          <div key={index} className="service-card">
            <div>{service.icon}</div>
            <h2>{service.title}</h2>
            <p className="description">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
