import React from 'react';
import Services from './Services';
import HowToUse from '../components/HowToUse';


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

