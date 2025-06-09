import React from 'react';
import Services from './Services';
import HowToUse from '../components/HowToUse';
import { Helmet } from "react-helmet";

function Home() {
  return (
    <div className="page-content">
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
        <meta property="og:image" content="/logo.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hire Professional Drivers | Sahyog Force" />
        <meta name="twitter:description" content="Book trained and verified drivers for personal or business needs. GST invoice provided. Trusted by thousands." />
        <meta name="twitter:image" content="/twitter.webp" />
      </Helmet>

      {/* Services Section */}
      <Services />

      {/* How to use section */}
      <HowToUse />
    </div>
  );
}

export default Home;
