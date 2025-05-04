import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import axios from "axios";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    bookingId,
    pickupLocation,
    bookingType,
    tripType,
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

    // Helper: fetch booking and check for driver fields
    const pollDriver = async () => {
      try {
        const resp = await axios.get(
          `http://65.0.163.37:8000/api/booking/${bookingId}`,
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

  const handleCancel = () => {
    navigate("/dashboard/bookings");
  };

  const handlePayCash = () => {
    alert(`Please pay ₹${totalAmount} in cash to your driver.`);
    navigate("/dashboard");
  };

  const handleUPIClick = () => setShowUPIScanner(true);
  const handleUPISuccess = () => {
    alert("UPI payment successful!");
    navigate("/dashboard");
  };

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
        <h1>Booking Confirmed</h1>
        <p>
          Our team will contact you shortly to confirm the driver details and
          preferences.
        </p>

        {assignedDriver ? (
          <div className="driver-details">
            <h2>Driver Assigned</h2>
            <p><strong>Name:</strong> {assignedDriver.name}</p>
            <p><strong>Phone:</strong> {assignedDriver.phone}</p>
          </div>
        ) : (
          <p className="waiting-msg">Waiting for driver assignment...</p>
        )}

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel Ride
        </button>
      </section>

      <section className="confirmation-right">
        <h2>Booking &amp; Billing</h2>
        <ul className="booking-summary">
          <li><strong>Booking Type:</strong> {bookingType} / {tripType}</li>
          <li><strong>Pickup:</strong> {pickupLocation}</li>
          <li><strong>Date &amp; Time:</strong> {bookingDatetime}</li>
        </ul>
        <p className="total-amount">Total Fare: ₹ {totalAmount}</p>

        <div className="payment-methods">
          <h3>Choose Payment Method</h3>
          <button className="pay-btn" onClick={handlePayCash}>
            Pay via Cash
          </button>
          <button className="pay-btn" onClick={handleUPIClick}>
            Pay via UPI
          </button>
        </div>

        {showUPIScanner && (
          <div className="upi-scanner">
            <h4>Scan to Pay</h4>
            <img src="/upi-qr.png" alt="UPI QR Code" />
            <button className="pay-btn" onClick={handleUPISuccess}>
              I’ve Paid
            </button>
          </div>
        )}
      </section>
    </div>
    </>
  );
};

export default BookingConfirmation;
