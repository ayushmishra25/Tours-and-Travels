import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    user,
  } = state || {};

  // assignedDriver will be populated by admin; here we simulate with null
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showUPIScanner, setShowUPIScanner] = useState(false);

  // Simulate admin assignment arriving after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignedDriver({
        name: "Ravi Kumar",
        phone: "+91 98765 43210",
        photoUrl: "/driver-photo.jpg",
        licenseLocation: "DL-04-2025-XYZ123",
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    navigate("/dashboard/bookings");
  };

  const handlePayCash = () => {
    alert("Please pay ₹" + totalAmount + " in cash to your driver.");
    navigate("/dashboard");
  };

  const handleUPIClick = () => {
    setShowUPIScanner(true);
  };

  const handleUPISuccess = () => {
    alert("UPI payment successful!");
    navigate("/dashboard");
  };

  return (
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
            <img
              src={assignedDriver.photoUrl}
              alt={assignedDriver.name}
              className="driver-photo"
            />
            <p><strong>Name:</strong> {assignedDriver.name}</p>
            <p><strong>Phone:</strong> {assignedDriver.phone}</p>
            <p>
              <strong>License No.:</strong> {assignedDriver.licenseLocation}
            </p>
          </div>
        ) : (
          <p className="waiting-msg">Waiting for driver assignment...</p>
        )}

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel Ride
        </button>
      </section>

      <section className="confirmation-right">
        <h2>Booking & Billing</h2>
        <ul className="booking-summary">
          <li><strong>Booking ID:</strong> {bookingId}</li>
          <li><strong>Type:</strong> {bookingType} / {tripType}</li>
          <li><strong>Pickup:</strong> {pickupLocation}</li>
          <li><strong>Date & Time:</strong> {bookingDatetime}</li>
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
            {/* Replace src with your QR image */}
            <img src="/upi-qr.png" alt="UPI QR Code" />
            <button className="pay-btn" onClick={handleUPISuccess}>
              I’ve Paid
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingConfirmation;
