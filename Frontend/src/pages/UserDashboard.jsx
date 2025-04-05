import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import DriverSection from "./DriverSection";
import Profile from "./Profile";
import Bookings from "./Bookings";
import Footer from "../components/Footer"; 


const UserDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      {/* Menu Bar */}
      

      {/* Main Content */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<DriverSection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </div>
       {/* Footer */}
       <Footer />
    </div>
  );
};

export default UserDashboard;
