import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

// Hourly pricing table
const hourlyPricing = {
  delhi: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  gurugram: [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
  faridabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  ghaziabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  noida: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  greater_noida: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
};

// Distance-based pricing table
const distancePricing = {
  south_delhi: { 5: 321, 10: 345, 15: 396, 20: 422, 30: 496, 40: 551, 50: 629, 60: 662, 70: 704 },
  gurugram: { 5: 297, 10: 322, 15: 372, 20: 399, 30: 473, 40: 528, 50: 606, 60: 638, 70: 681 },
  faridabad: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  manesar: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  ghaziabad: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  noida: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  greater_noida: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  east_delhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  north_delhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  central_delhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
};

const getCityFromAddress = (address) => {
  const lower = address.toLowerCase();
  if (lower.includes("south delhi")) return "south_delhi";
  if (lower.includes("north delhi")) return "north_delhi";
  if (lower.includes("central delhi")) return "central_delhi";
  if (lower.includes("manesar")) return "manesar";
  if (lower.includes("east delhi")) return "east_delhi";
  if (lower.includes("gurugram") || lower.includes("gurgaon")) return "gurugram";
  if (lower.includes("faridabad")) return "faridabad";
  if (lower.includes("ghaziabad")) return "ghaziabad";
  if (lower.includes("greater noida")) return "greater_noida";
  if (lower.includes("noida")) return "noida";
  if (lower.includes("delhi")) return "delhi";
  return null;
};

const HourlyDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [hours, setHours] = useState(5);
  const [distance, setDistance] = useState(5);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [authError, setAuthError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) ||  "User not authenticated" ;

  const calculateFare = () => {
    if (!pickup || !destination) return 0;
    const city = getCityFromAddress(pickup);
    if (tripType === "roundtrip") {
      return hourlyPricing[city]?.[hours - 1] ?? 0;
    } else {
      return distancePricing[city]?.[distance] ?? 0;
    }
  };

  const handleBookNow = async () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      return;
    }
    setAuthError("");

    if (!date || !time) {
      setAuthError("Please select both a date and a time.");
      return;
    }

    const booking_datetime = `${date} ${time}:00`;

    const payload = {
      user_id: parseInt(localStorage.getItem("userId")),
      booking_type: "Hourly",
      trip_type: tripType,
      source_location: pickup,
      destination_location: destination,
      hours: tripType === "roundtrip" ? hours : undefined,
      distance: tripType === "oneway" ? distance : undefined,
      payment: totalAmount,
      booking_datetime,
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

  const formatDateLocal = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    setMinDate(formatDateLocal(tomorrow));
    setMaxDate(formatDateLocal(nextWeek));
  }, []);

  useEffect(() => {
    setTotalAmount(calculateFare());
  }, [pickup, destination, tripType, hours, distance]);
  

  return (
    <>
      <DashboardNavbar />
      <div className="hourly-driver-container">
        <div className="trip-selection">
          <div
            className={`trip-option ${tripType === "roundtrip" ? "selected" : ""}`}
            onClick={() => setTripType("roundtrip")}
          >
            <p>Round Trip</p>
          </div>
          <div
            className={`trip-option ${tripType === "oneway" ? "selected" : ""}`}
            onClick={() => setTripType("oneway")}
          >
            <p>One Way Drop</p>
          </div>
        </div>

        <div className="booking-form">
          <div className="left-section">
            <h3>Select {tripType === "roundtrip" ? "Hours" : "Distance"}</h3>
            {tripType === "roundtrip" ? (
              <select value={hours} onChange={(e) => setHours(+e.target.value)}>
                {[...Array(12).keys()].map((h) => (
                  <option key={h + 1} value={h + 1}>
                    {h + 1} Hour(s)
                  </option>
                ))}
              </select>
            ) : (
              <select value={distance} onChange={(e) => setDistance(+e.target.value)}>
                {[5, 10, 15, 20, 30, 40, 50, 60, 70].map((d) => (
                  <option key={d} value={d}>
                    {d} km
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Enter Pickup Address"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Destination Address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <div className="date-time-container">
              <input type="date" value={date} min={minDate} max={maxDate} onChange={(e) => setDate(e.target.value)} />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="right-section">
            <h3>User Details</h3>
            <p>Name: {user.name}</p>
            <p>Phone: {user.phone}</p>

            <h2>₹ {totalAmount}</h2>
            <button className="book-now-btn" onClick={handleBookNow}>
            Book Now
          </button>
          {authError && <p className="error-message">{authError}</p>}

            <p className="price-note">
            You may cancel your ride up to one hour before the scheduled start time without any charge. Cancellations made within one hour of service will incur a ₹100 fee.
              For distances above 80 km, an additional charge of ₹10/km will be applied, including food,
              accommodation, and convenience. Night charges apply if an overnight stay is required.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourlyDriver;
