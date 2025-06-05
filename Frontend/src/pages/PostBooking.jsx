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

  useEffect(() => {
    if (!bookingId) {
      console.warn("No bookingId passed into BookingConfirmation");
      return;
    }
  
  }, [bookingId, token]); 

  // If we haven't even loaded the booking info yet, show a loader
  if (!bookingId) {
    return <p>Invalid booking. Please go back and try again.</p>;
  }

  return (
    <>
      <Helmet>
        <title>Booking Confirmation</title>
      </Helmet>
      {/* ← Dashboard navbar */}
      <DashboardNavbar />
      <div className="confirmation-wrapper">
        <section className="confirmation-left">
          <p>
            Our team will contact you shortly to confirm the driver details and
            preferences.
          </p>
          <p>
            After sometime you can check your assigned driver on your "My Bookings" page.
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
            If you want to cancel your ride, you can proceed to the "My Bookings" page.
          </p>
        </section>
      </div>
    </>
  );
};

export default BookingConfirmation;
