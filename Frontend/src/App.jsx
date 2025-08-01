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
import Earnings from './pages/Earnings';
import DriverRides from './pages/DriverRides';
import Support from './pages/Support';
import DriverProfile from './pages/DriverProfile';
import PostBooking from './pages/PostBooking';
import InvoicePage from './pages/InvoicePage';
import FinalTnC from './pages/FinalTnC';
import DriverDetailUploadEditable from './pages/DriverDetailsUploadEditable';
import AssignedDriver from './pages/AssignedDriver';
import UserRidesOnAdmin from './pages/UserRidesOnAdmin';
import DriverTripsOnAdmin from './pages/DriverTripsOnAdmin';
import DriverEarningOnAdmin from './pages/DriverEarningsOnAdmin';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyAndPolicy from './pages/PrivacyAndPolicy';
import LandingPage from './pages/Landing';

import ProtectedRoute from './components/ProtectedRoute';
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
  // Paths where we want to hide navbar/footer
  const noShellPaths = ['/driverjobdetails','/driver-details-upload','/invoice','/final-tnc','/assigned-driver','/admin/dashboard','/forgot-password', '/LandingPage'];
  const hideShell = noShellPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Conditionally render navbars: hide on specific paths */}
      {!hideShell && (!isDashboard ? <Navbar /> : <DashboardNavbar />)}

      <Routes>
        {/* Admin panel */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />

        {/* Login only after registration */}
        <Route
          path="/login"
          element={
              <Login />
          }
        />

        {/* User dashboard (you can wrap similarly if needed) */}
        <Route path="/dashboard/*" element={<UserDashboard />} />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Booking pages (public) */}
        <Route path="/hourly-driver" element={<HourlyDriver />} />
        <Route path="/weekly-driver" element={<WeeklyDriver />} />
        <Route path="/monthly-driver" element={<MonthlyDriver />} />
        <Route path="/ondemand-driver" element={<OndemandDriver />} />

        {/* Driver-only flow */}
        <Route
          path="/driverjobdetails"
          element={
              <DriverJobDetails />
          }
        />

        <Route 
          path="/driver-details-upload-editable/:driverId" 
          element={
            <DriverDetailUploadEditable />
            } 
        />

        <Route path="/driver-details-upload" element={<DriverDetailsUpload />} />


        <Route
          path="/driver-details-upload-editable"
          element={
              <DriverDetailUploadEditable />
          }
        />

        <Route
          path="/driver-dashboard"
          element={
              <DriverDashboard />
          }
        />
        
        <Route path="/earnings" element={<Earnings /> } />
       <Route
          path="/trip-history"
          element={
             <DriverRides />
            }
        />
        
       <Route
          path="/support"
          element={
             <Support />
            }
        />

        <Route
          path="/driver-profile"
          element={
              <DriverProfile />
          }
        />
        <Route path="/post-booking" element={<PostBooking />} />
        <Route path="/invoice/:booking_id" element={<InvoicePage />} />
        <Route path="/final-tnc/:booking_id" element={<FinalTnC />} />
        <Route path="/assigned-driver/:booking_id" element={<AssignedDriver />} />
        <Route path="/driver-earnings" element={<Earnings />} />
        <Route path="/user-rides-on-admin/:userId" element={<UserRidesOnAdmin />} />
        <Route path="/driver-trips-on-admin/:driverId" element={<DriverTripsOnAdmin />} />
        <Route path="/driver-earning-on-admin/:driverId" element={<DriverEarningOnAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy-and-policy" element={<PrivacyAndPolicy /> } />
        <Route path="/LandingPage" element={<LandingPage /> } />

        {/* Any unmatched goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Conditionally render footer: hide on dashboard and specific paths */}
      {!hideShell && !isDashboard && <Footer />}
    </>
  );
};

export default App;