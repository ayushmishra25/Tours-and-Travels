import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

const WeeklyDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  
  const [authError, setAuthError] = useState("");                     // ← will hold auth errors
  const [fieldError, setFieldError] = useState(""); 

  const user = { name: "John Doe", phone: "+91 9876543210" };

  // Function to extract city from the entered location (manual input)
  const getCityFromAddress = (address) => {
    const lower = address.toLowerCase();
    if (lower.includes("hyderabad")) return "Hyderabad";
    if (lower.includes("bangalore") || lower.includes("bengaluru")) return "Bangalore";
    return "others";
  };

  // Calculate fare: if city is Hyderabad/Bangalore daily rate = 1400, else 1250
  const calculateFare = () => {
    if (!location || !workingDays) return 0;
    const city = getCityFromAddress(location);
    const days = parseInt(workingDays, 10);
    let dailyRate = 1250;
    if (city === "Hyderabad" || city === "Bangalore") {
      dailyRate = 1400;
    }
    return dailyRate * days;
  };

  useEffect(() => {
    const fare = calculateFare();
    setTotalAmount(fare);
  }, [location, workingDays]);

  const handleBookNow = () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      setFieldError("");
      return;
    }
    setAuthError("");
    // 2) Validate each field
    if (!location.trim()) {
      setFieldError("Location is required");
      return;
    }
    if (!workingDays) {
      setFieldError("Working days selection is required");
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

    // ▶️ All good—navigate to post-booking page with details:
    const bookingData = {
      bookingId: Date.now(),                             // unique ID
      pickupLocation,                                    // new field
      bookingType: "weekly",
      tripType: `${workingDays} days`,
      bookingDatetime: `${date} ${time}`,
      totalAmount,
      user,
    };
    navigate("/post-booking", { state: bookingData });
  };

  return (
    <>
      <DashboardNavbar />
      <div className="weekly-driver-container">
        <h1>Weekly Driver Service</h1>
        <div className="booking-form">
          <div className="left-section">
            <label>
              Zone:
              <input
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <label>
              Pickup Location:
              <input
                type="text"
                placeholder="Enter Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </label>
            <label>
              Working Days:
              <select
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
              >
                <option value="">Select Days</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
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
              you can cancel the ride before one hour of service, otherwise you need to pay cancellation charges 100rs.
              Please note: For each night stay, an extra charge of ₹300 applies,
              along with food and accommodation costs. Pricing is negotiable;
              we will contact you soon to confirm the details.
            </p>
            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>

            {/* Display either auth errors or field validation errors */}
            {authError && <p className="error-message">{authError}</p>}
            {!authError && fieldError && <p className="error-message">{fieldError}</p>}

            
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyDriver;
