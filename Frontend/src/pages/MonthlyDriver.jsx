import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import { Helmet } from "react-helmet";

// Pricing tables for monthly driver service
const monthlyPricing = {
  "East Delhi": {
    "22": { "8": 17000, "10": 17500, "12": 18500 },
    "24": { "8": 17500, "10": 18500, "12": 19500 },
    "26": { "8": 18000, "10": 19000, "12": 20000 }
  },
  "North Delhi": {
    "22": { "8": 17000, "10": 17500, "12": 18500 },
    "24": { "8": 17500, "10": 17500, "12": 19500 },
    "26": { "8": 18000, "10": 19000, "12": 20000 }
  },
  "South Delhi": {
    "22": { "8": 19000, "10": 20000, "12": 21000 },
    "24": { "8": 19500, "10": 21000, "12": 22000 },
    "26": { "8": 21000, "10": 22000, "12": 23000 }
  },
  "West Delhi": {
    "22": { "8": 17500, "10": 18500, "12": 19500 },
    "24": { "8": 18000, "10": 19000, "12": 20000 },
    "26": { "8": 19000, "10": 20000, "12": 21000 }
  },
  Gurugram: {
    "22": { "8": 18500, "10": 19500, "12": 20500 },
    "24": { "8": 19500, "10": 20500, "12": 21500 },
    "26": { "8": 20000, "10": 21000, "12": 22000 }
  },
  Faridabad: {
    "22": { "8": 18000, "10": 19000, "12": 20000 },
    "24": { "8": 19000, "10": 20000, "12": 21000 },
    "26": { "8": 20000, "10": 21000, "12": 22000 }
  },
  Ghaziabad: {
    "22": { "8": 16000, "10": 17000, "12": 18000 },
    "24": { "8": 17000, "10": 18000, "12": 19000 },
    "26": { "8": 18000, "10": 19000, "12": 20000 }
  },
  Noida: {
    "22": { "8": 17000, "10": 18000, "12": 19000 },
    "24": { "8": 18000, "10": 19000, "12": 20000 },
    "26": { "8": 19000, "10": 20000, "12": 21000 }
  },
  "Greater Noida": {
    "22": { "8": 17000, "10": 18000, "12": 19000 },
    "24": { "8": 18000, "10": 19000, "12": 20000 },
    "26": { "8": 19000, "10": 20000, "12": 21000 }
  },
};

const MonthlyDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [workingDays, setWorkingDays] = useState("22");
  const [workingHours, setWorkingHours] = useState("8");
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [authError, setAuthError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || "User not authenticated";

  // Replace this with your actual pricing logic
  

  const calculateFare = () => {
    if (!location) return 0;
    const pricing = monthlyPricing[location];
    if (pricing && pricing[workingDays] && pricing[workingDays][workingHours]) {
      return pricing[workingDays][workingHours];
    }
    return 0;
  };

  useEffect(() => {
    const fare = calculateFare();
    setTotalAmount(fare);
  }, [location, workingDays, workingHours]);

  const handleBookNow = async () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      setFieldError("");
      return;
    }
    setAuthError("");

    if (!location || !workingDays || !workingHours || !date || !pickupLocation || !destinationLocation) {
      setFieldError("All fields are required");
      return;
    }

    setFieldError("");

    // ✅ Format booking_datetime correctly as "Y-m-d H:i:s"
    const now = new Date();
    const formattedDatetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    const bookingData = {
      booking_type: "Monthly",
      trip_type: "M", 
      source_location: pickupLocation,
      destination_location: destinationLocation,
      hours: null,
      working_days: parseInt(workingDays),
      working_hours_per_day: parseInt(workingHours),
      start_date: date,
      booking_datetime: formattedDatetime,
      payment: totalAmount
    };
     
    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    try {
      const response = await axios.post(`${baseURL}/api/booking`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const { booking } = response.data;

      navigate("/post-booking", {
        state: {
          bookingId: booking.id,
          pickupLocation: booking.source_location,
          destinationLocation: booking.destination_location,
          bookingType: booking.booking_type,
          tripType: booking.trip_type,
          bookingDatetime: booking.booking_datetime,
          totalAmount: booking.payment,
          user
        }
      });
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      setFieldError("An error occurred while booking. Please try again.");
    }
  };

  


  return (
    <>
      <DashboardNavbar />
      <div className="monthly-driver-container">
        <h1>Monthly Driver Service</h1>
        <div className="booking-form">
          <div className="left-section">
            <label>
              Zone:
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Select Location</option>
                {Object.keys(monthlyPricing).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
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
                Destination Location:
                <input
                  type="text"
                  placeholder="Enter Destination Location"
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                />
              </label>
            <label>
              Working Days:
              <select value={workingDays} onChange={(e) => setWorkingDays(e.target.value)}>
                <option value="22">22 days</option>
                <option value="24">24 days</option>
                <option value="26">26 days</option>
              </select>
            </label>
            <label>
              Working Hours per Day:
              <select value={workingHours} onChange={(e) => setWorkingHours(e.target.value)}>
                <option value="8">8 Hours</option>
                <option value="10">10 Hours</option>
                <option value="12">12 Hours</option>
              </select>
            </label>
            <label>
              Start Date:
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
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
            {!authError && fieldError && <p className="error-message">{fieldError}</p>}

            
            <p className="price-note">
            ₹ 4000 will be charged Annually for the monthly driver services. 
            You may cancel your ride up to one hour before the scheduled start time without any charge. Cancellations made within one hour of service will incur a ₹100 fee.  
            For long-distance travel, accommodation, food, and night stays, extra charges apply.
            The mentioned amount is the starting price. Final charges may vary based on your specific requirements, preferences, and service duration.
            We understand that every requirement is unique, Once you submit your request, we will contact you soon to discuss the details.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyDriver;
