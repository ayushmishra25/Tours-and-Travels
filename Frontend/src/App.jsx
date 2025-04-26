import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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

{/* import ProtectedRoute from './components/ProtectedRoute'; */}
import AdminApp from './admin/AdminApp';

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
      {/* Public vs dashboard navbars */}
      {!isDashboard && <Navbar />}
      {isDashboard && <DashboardNavbar />}

      <Routes>
        {/* Admin panel */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />

        {/* Login only after registration */}
        <Route path="/login" element={<Login /> }/>
        {/* <Route path="/login" element={<ProtectedRoute step="login"><Login /></ProtectedRoute>  }/> */}
        {/* User dashboard (you can wrap similarly if needed) */}
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        {/* Booking pages (public) */}
        <Route path="/hourly-driver" element={<HourlyDriver />} />
        <Route path="/weekly-driver" element={<WeeklyDriver />} />
        <Route path="/monthly-driver" element={<MonthlyDriver />} />
        <Route path="/ondemand-driver" element={<OndemandDriver />} />
        {/* Driver-only flow */}
        { /* <Route path="/driverjobdetails" element={ <ProtectedRoute allowedRoles={[1]} step="jobdetails">  <DriverJobDetails /></ProtectedRoute>} /> */}
        <Route path="/driverjobdetails" element={<DriverJobDetails />}/>
        <Route path="/driver-details-upload" element={ <DriverDetailsUpload /> }/>
        {/* <Route path="/driver-details-upload" element={<ProtectedRoute allowedRoles={[1]} step="upload">  <DriverDetailsUpload /> </ProtectedRoute>}/> */}
        {/* <Route path="/driver-dashboard"element={ <ProtectedRoute allowedRoles={[1]} step="dashboard"><DriverDashboard /></ProtectedRoute>} /> */}
        <Route path="/driver-dashboard"element={ <DriverDashboard /> } />
        {/* Any unmatched goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Footer hidden on user-dashboard but shown everywhere else */}
      {!isDashboard && <Footer />}
    </>
  );
};

export default App;
