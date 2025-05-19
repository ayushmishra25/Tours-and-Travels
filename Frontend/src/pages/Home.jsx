import React from 'react';
import Services from './Services';
import HowToUse from '../components/HowToUse';
import { Helmet } from "react-helmet";

function Home() {
  return (
    <div className="page-content">
      
      {/* Services Section */}
      <Services />

      {/* Hoe to use section */ }
      <HowToUse />
    </div>
  );
}

export default Home;

