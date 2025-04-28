import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [authError, setAuthError] = useState("");                     // ← auth error
  const [fieldError, setFieldError] = useState("");  

  const user = { name: "John Doe", phone: "+91 9876543210" };

  const baseFare = 50;
  const perKmRate = 15;

  // Calculate fare dynamically
  const calculateFare = () => {
    const d = parseFloat(distance);
    return isNaN(d) ? 0 : baseFare + d * perKmRate;
  };

  useEffect(() => {
    if (pickup && destination && distance) {
      setTotalAmount(calculateFare());
    }
  }, [pickup, destination, distance]);

  // Function to fetch current location and convert to an address
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

          try {
            const response = await fetch(reverseGeocodeUrl);
            const data = await response.json();
            const address = data.display_name || "Location not found";
            setPickup(address); // Set the fetched address in the input field
          } catch (error) {
            console.error("Error fetching address:", error);
            setPickup("Failed to fetch location");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setPickup("Unable to fetch location");
        }
      );
    } else {
      setPickup("Geolocation not supported");
    }
  };

  const handleBookNow = () => {
    // 1) Auth check
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      setFieldError("");
      return;
    }
    setAuthError("");

    // 2) Field validations
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

    // 3) Proceed
    alert(`On-demand driver booked for ₹ ${totalAmount}`);
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
              <div className="location-input">
                <input
                  type="text"
                  placeholder="Enter Pickup Address"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
                <button className="location-btn" onClick={fetchLocation}>
                  Use My Location
                </button>
              </div>
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
