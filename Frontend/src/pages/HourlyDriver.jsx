import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";


// Pricing tables for hourly and distance-based fares
const hourlyPricing = {
  Delhi: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Gurugram: [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
  Faridabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Ghaziabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Noida: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  GreaterNoida: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Bangalore: [276, 376, 477, 572, 674, 778, 880, 972, 1170, 1171, 1281, 1380],
  Hyderabad: [270, 340, 410, 480, 560, 640, 720, 800, 880, 980, 1080, 1180],
  Mumbai: [270, 340, 410, 480, 560, 640, 720, 820, 920, 1020, 1130, 1240],
  NaviMumbai: [270, 340, 410, 480, 560, 640, 720, 820, 920, 1020, 1130, 1240],
  thane: [270, 340, 410, 480, 560, 640, 720, 820, 920, 1020, 1130, 1240],
  Pune: [225, 295, 370, 450, 535, 637, 690, 783, 842, 922, 1012, 1082]
};

const distancePricing = {
  Hyderabad: { 5: 272, 10: 298, 15: 348, 20: 375, 30: 449, 40: 504, 50: 582, 60: 614, 70: 657 },
  Bangalore: { 5: 225, 10: 297, 15: 343, 20: 375, 30: 448, 40: 503, 50: 582, 60: 614, 70: 656 },
  Navi_Mumbai: { 5: 321, 10: 345, 15: 396, 20: 422, 30: 496, 40: 551, 50: 629, 60: 662, 70: 704 },
  Thane: { 5: 321, 10: 345, 15: 396, 20: 422, 30: 496, 40: 551, 50: 629, 60: 662, 70: 704 },
  SouthDelhi: { 5: 321, 10: 345, 15: 396, 20: 422, 30: 496, 40: 551, 50: 629, 60: 662, 70: 704 },
  Gurugram: { 5: 297, 10: 322, 15: 372, 20: 399, 30: 473, 40: 528, 50: 606, 60: 638, 70: 681 },
  Mumbai: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  Pune: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  Faridabad: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  MAnesar: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  Ghaziabad: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  Noida: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  GreaterNoida: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  EastDelhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  SouthDelhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  NorthDelhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  CentralDelhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 }
};

const getCityFromAddress = (address) => {
  const lower = address.toLowerCase();
  if (lower.includes("delhi")) return "Delhi";
  if (lower.includes("gurugram") || lower.includes("gurgaon")) return "Gurugram";
  if (lower.includes("faridabad")) return "Faridabad";
  if (lower.includes("ghaziabad")) return "Ghaziabad";
  if (lower.includes("noida")) return "Noida";
  if (lower.includes("greater noida")) return "GreaterNoida";
  if (lower.includes("bangalore") || lower.includes("bengaluru")) return "Bangalore";
  if (lower.includes("hyderabad")) return "Hyderabad";
  if (lower.includes("mumbai")) return "Mumbai";
  if (lower.includes("navi mumbai")) return "NaviMumbai";
  if (lower.includes("thane")) return "Thane";
  if (lower.includes("pune")) return "Pune";
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
  const user = JSON.parse(localStorage.getItem("user")) || { name: "John Doe", phone: "+91 9876543210" };

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
  
    // Combine date and time into the format Y-m-d H:i:s
    const booking_datetime = `${date} ${time}:00`;

    // Build payload
    const payload = {
      user_id: parseInt(localStorage.getItem("userId")),
      booking_type: "hourly",
      trip_type: tripType,
      source_location: pickup,
      destination_location: destination,
      hours: tripType === "roundtrip" ? hours : undefined,
      distance: tripType === "oneway" ? distance : undefined,
      payment: totalAmount,   // ✅ Fixed colon here
      booking_datetime,
    };

    try {
      const resp = await axios.post(
        "http://localhost:8000/api/booking",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // → after success, send booking details into state and navigate:
      navigate("/booking-confirmation", {
        state: {
          bookingId: resp.data.id,
          pickupLocation: pickup,
          bookingType: "Hourly",
          tripType,
          bookingDatetime: booking_datetime,
          totalAmount,
          user: JSON.parse(localStorage.getItem("user")),
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      setAuthError("Booking failed. Please try again.");
    }
  };

  const formatDateLocal = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
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
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map((d) => (
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
