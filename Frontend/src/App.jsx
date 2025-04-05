import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import DashboardNavbar from "./components/DashboardNavbar";
import TermsAndConditions from "./pages/TermsAndConditions";
import HourlyDriver from './pages/HourlyDriver';
import MonthlyDriver from './pages/MonthlyDriver';
import WeeklyDriver from './pages/WeeklyDriver';
import OndemandDriver from './pages/OndemandDriver';
import DriverJobDetails from './pages/DriverJobDetails';
import DriverNavbar from './components/DriverNavbar';
import DriverDashboard from './pages/DriverDashboard';
import DriverDetailsUpload from './pages/DriverDetailsUpload';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

const MainContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}   {/* Show Navbar only if not on Dashboard */}
      {isDashboard && <DashboardNavbar />}  {/* Show Dashboard Navbar only on Dashboard */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/hourly-driver" element={<HourlyDriver />} />
        <Route path="/monthly-driver" element={<MonthlyDriver />} />
        <Route path="/weekly-driver" element={<WeeklyDriver />} />
        <Route path="/ondemand-driver" element={<OndemandDriver />} />
        <Route path="/driverjobdetails" element={<DriverJobDetails />} />
        <Route path="/driver-navbar" element={<DriverNavbar />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver-details-upload" element={<DriverDetailsUpload />} />
      </Routes>

      {!isDashboard && <Footer />}  {/* Hide Footer on Dashboard */}
    </>
  );
};

export default App;

