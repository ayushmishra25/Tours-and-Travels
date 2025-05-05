import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const OndemandDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [authError, setAuthError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    phone: "+91 9876543210",
  };

  const baseFare = 50;
  const perKmRate = 15;

  const calculateFare = () => {
    const d = parseFloat(distance);
    return isNaN(d) ? 0 : baseFare + d * perKmRate;
  };

  useEffect(() => {
    if (pickup && destination && distance) {
      setTotalAmount(calculateFare());
    }
  }, [pickup, destination, distance]);

  const handleBookNow = async () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      setFieldError("");
      return;
    }
    setAuthError("");

    if (!pickup.trim()) {
      setFieldError("Pickup address is required");
      return;
    }
    if (!destination.trim()) {
      setFieldError("Destination address is required");
      return;
    }
    if (!distance) {
      setFieldError("Distance is required");
      return;
    }
    if (!date) {
      setFieldError("Date is required");
      return;
    }
    if (!time) {
      setFieldError("Time is required");
      return;
    }
    setFieldError("");

    const bookingDatetime = `${date} ${time}:00`;
    const payload = {
      booking_type: "On demand", // Ensure this value is accepted by your database
      trip_type: "one-way", // Ensure this value is accepted by your database
      source_location: pickup,
      destination_location: destination,
      distance: parseFloat(distance),
      booking_datetime: bookingDatetime,
      payment: totalAmount,
    };

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    try {
      const resp = await axios.post(`${baseURL}/api/booking`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { booking } = resp.data;

      navigate("/post-booking", {
        state: {
          bookingId: booking.id,
          pickupLocation: booking.source_location,
          destinationLocation: booking.destination_location,
          bookingType: booking.booking_type,
          tripType: booking.trip_type,
          bookingDatetime: booking.booking_datetime,
          totalAmount: booking.payment,
          user,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      setAuthError("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="ondemand-driver-container">
        <h1>On-Demand Driver Service</h1>
        <div className="booking-form">
          <div className="left-section">
            <label>
              Pickup Address:
              <input
                type="text"
                placeholder="Enter Pickup Address"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </label>
            <label>
              Destination Address:
              <input
                type="text"
                placeholder="Enter Destination Address"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </label>
            <label>
              Distance (in km):
              <input
                type="number"
                placeholder="Enter Distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </label>
            <label>
              Date:
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Time:
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>
          <div className="right-section">
            <h3>User Details</h3>
            <p>Name: {user.name}</p>
            <p>Phone: {user.phone}</p>
            <h2>₹ {totalAmount}</h2>
            <p className="price-note">
              Please note: On-demand services may have surge pricing during peak hours.
              Extra charges for food, accommodation, and night stays may apply.
              Pricing is negotiable.
              You may cancel your ride up to one hour before the scheduled start time without any charge. Cancellations made within one hour of service will incur a ₹100 fee.
            </p>
            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>

            {authError && <p className="error-message">{authError}</p>}
            {!authError && fieldError && <p className="error-message">{fieldError}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default OndemandDriver;
