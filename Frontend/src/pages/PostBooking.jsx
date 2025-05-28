import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import axios from "axios";
import { Helmet } from "react-helmet";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    bookingId,
    pickupLocation,
    bookingType,
    bookingDatetime,
    totalAmount,
  } = state || {};

  // Grab token for authenticated requests
  const token = localStorage.getItem("token");

  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showUPIScanner, setShowUPIScanner] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      console.warn("No bookingId passed into BookingConfirmation");
      return;
    }

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    // Helper: fetch booking and check for driver fields
    const pollDriver = async () => {
      try {
        const resp = await axios.get(
          `${baseURL}/api/booking/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("pollDriver response:", resp.data);

        const booking = resp.data.booking;
        const name     = booking.driver_name;
        const contact  = booking.driver_contact;

        if (name && contact) {
          setAssignedDriver({
            name,
            phone: contact,
          });
          return true;  // stop polling
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
      }
      return false; 
    };

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      if (await pollDriver()) {
        clearInterval(interval);
      }
    }, 3000);

    // Also do an immediate check
    (async () => {
      if (await pollDriver()) {
        clearInterval(interval);
      }
    })();

    return () => clearInterval(interval);
  }, [bookingId, token]);


  // If we haven't even loaded the booking info yet, show a loader
  if (!bookingId) {
    return <p>Invalid booking. Please go back and try again.</p>;
  }

  return (
    <>
      {/* ← Dashboard navbar */}
      <DashboardNavbar />
    <div className="confirmation-wrapper">
      <section className="confirmation-left">
        <p>
          Our team will contact you shortly to confirm the driver details and
          preferences.
        </p>
        <p>
          After sometime you can check you assigned driver on you my bookings page.
        </p>

      </section>

      <section className="confirmation-right">
        <h2>Booking &amp; Billing</h2>
        <ul className="booking-summary">
          <li><strong>Booking Type:</strong> {bookingType}</li>
          <li><strong>Pickup:</strong> {pickupLocation}</li>
          <li><strong>Date &amp; Time:</strong> {bookingDatetime}</li>
        </ul>
        <p className="total-amount">Total Fare: ₹ {totalAmount}</p>
        <p>
          If you want to cancel you ride you can proceed to my bookings page.
        </p>

        
      </section>
    </div>
    </>
  );
};

export default BookingConfirmation;
