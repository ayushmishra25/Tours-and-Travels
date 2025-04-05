import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

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
  Bangalore: {
    "22": { "8": 24000, "10": 25000, "12": 26000 },
    "24": { "8": 25000, "10": 26000, "12": 27000 },
    "26": { "8": 26000, "10": 27000, "12": 28000 }
  },
  Hyderabad: {
    "22": { "8": 22000, "10": 23000, "12": 24000 },
    "24": { "8": 23000, "10": 24000, "12": 25000 },
    "26": { "8": 24000, "10": 25000, "12": 26000 }
  },
  Mumbai: {
    "22": { "8": 20000, "10": 21000, "12": 22000 },
    "24": { "8": 21000, "10": 22000, "12": 23000 },
    "26": { "8": 22000, "10": 23000, "12": 24000 }
  },
  "Navi Mumbai": {
    "22": { "8": 17000, "10": 18000, "12": 19000 },
    "24": { "8": 18000, "10": 19000, "12": 20000 },
    "26": { "8": 19000, "10": 20000, "12": 21000 }
  },
  Thane: {
    "22": { "8": 18000, "10": 19000, "12": 20000 },
    "24": { "8": 19000, "10": 20000, "12": 21000 },
    "26": { "8": 20000, "10": 21000, "12": 22000 }
  },
  Pune: {
    "22": { "8": 20000, "10": 21000, "12": 22000 },
    "24": { "8": 21000, "10": 22000, "12": 23000 },
    "26": { "8": 23000, "10": 24000, "12": 25000 }
  }
};

const MonthlyDriver = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [workingDays, setWorkingDays] = useState("22");
  const [workingHours, setWorkingHours] = useState("8");
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const user = { name: "John Doe", phone: "+91 9876543210" };

  // Calculate fare based on selected location, working days, and working hours
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

  const handleBookNow = () => {
    alert("Monthly driver booked for ₹ " + totalAmount);
    // Implement further booking logic if needed
  };

  return (
    <>
      <DashboardNavbar />
      <div className="monthly-driver-container">
        <h1>Monthly Driver Service</h1>
        <div className="booking-form">
          <div className="left-section">
            <label>
              Location:
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
            <p className="price-note">
            For long-distance travel, accommodation, food, and night stays, extra charges apply.
            We understand that every requirement is unique, so **pricing can be negotiated as per the requirements and preferences.** Once you submit your request, we will contact you soon to discuss the details.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyDriver;
