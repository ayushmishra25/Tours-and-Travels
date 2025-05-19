import React from 'react';
import Services from './Services';
import HowToUse from '../components/HowToUse';
import { Helmet } from "react-helmet";

function Home() {
  return (
    <div className="page-content">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Sahyog Force | Empowering Communities</title>
        <meta name="description" content="Sahyog Force is dedicated to empowering communities through services and guidance. Join us in creating impact and awareness." />
        <meta name="keywords" content="Sahyog Force, NGO, Community, Services, Social Work, India" />
        <meta name="author" content="Sahyog Force" />
        <meta property="og:title" content="Sahyog Force" />
        <meta property="og:description" content="Empowering communities through support and service." />
        <meta property="og:url" content="https://www.sahyogforce.com" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Services Section */}
      <Services />

      {/* How to use section */}
      <HowToUse />
    </div>
  );
}

export default Home;
