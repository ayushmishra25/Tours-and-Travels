import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

// Pricing tables for hourly and distance-based fares
const hourlyPricing = {
  Delhi: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Gurugram: [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
  Faridabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Ghaziabad: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Noida: [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
  Bangalore: [276, 376, 477, 572, 674, 778, 880, 972, 1170, 1171, 1281, 1380],
  Hyderabad: [270, 340, 410, 480, 560, 640, 720, 800, 880, 980, 1080, 1180],
  Mumbai: [270, 340, 410, 480, 560, 640, 720, 820, 920, 1020, 1130, 1240],
  Pune: [225, 295, 370, 450, 535, 637, 690, 783, 842, 922, 1012, 1082]
};

const distancePricing = {
  Hyderabad: { 5: 272, 10: 298, 15: 348, 20: 375, 30: 449, 40: 504, 50: 582, 60: 614, 70: 657 },
  Bangalore: { 5: 225, 10: 297, 15: 343, 20: 375, 30: 448, 40: 503, 50: 582, 60: 614, 70: 656 },
  "Navi Mumbai": { 5: 321, 10: 345, 15: 396, 20: 422, 30: 496, 40: 551, 50: 629, 60: 662, 70: 704 },
  Gurugram: { 5: 297, 10: 322, 15: 372, 20: 399, 30: 473, 40: 528, 50: 606, 60: 638, 70: 681 },
  MumbaiPune: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 },
  Delhi: { 5: 226, 10: 250, 15: 301, 20: 327, 30: 401, 40: 456, 50: 534, 60: 563, 70: 609 }
};

// Function to extract city from the pickup address based on keywords
const getCityFromAddress = (address) => {
  const lower = address.toLowerCase();
  if (lower.includes("delhi")) return "Delhi";
  if (lower.includes("gurugram") || lower.includes("gurgaon")) return "Gurugram";
  if (lower.includes("faridabad")) return "Faridabad";
  if (lower.includes("ghaziabad")) return "Ghaziabad";
  if (lower.includes("noida")) return "Noida";
  if (lower.includes("bangalore") || lower.includes("bengaluru")) return "Bangalore";
  if (lower.includes("hyderabad")) return "Hyderabad";
  if (lower.includes("mumbai")) return "Mumbai";
  if (lower.includes("pune")) return "Pune";
  if (lower.includes("navi mumbai")) return "Navi Mumbai";
  return null; // City not identified
};

const HourlyDriver = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [hours, setHours] = useState(5);
  const [distance, setDistance] = useState(5);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // ✅ New state for showing inline auth message
  const [authError, setAuthError] = useState("");

  const user = { name: "John Doe", phone: "+91 9876543210" };

  // New fare calculation based on pickup address and trip type
  const calculateFare = () => {
    if (!pickup || !destination) return 0;
    let city = getCityFromAddress(pickup);
    // Fallback to "Delhi" if no city is detected
    if (!city) city = "Delhi";
    
    if (tripType === "roundtrip") {
      const pricing = hourlyPricing[city];
      if (pricing && pricing[hours - 1] !== undefined) {
        return pricing[hours - 1];
      }
    } else {
      let pricing;
      if (city === "Hyderabad") {
        pricing = distancePricing["Hyderabad"];
      } else if (city === "Bangalore") {
        pricing = distancePricing["Bangalore"];
      } else if (city === "Gurugram") {
        pricing = distancePricing["Gurugram"];
      } else if (city === "Mumbai" || city === "Pune") {
        pricing = distancePricing["MumbaiPune"];
      } else if (city === "Delhi") {
        pricing = distancePricing["Delhi"];
      } else if (city === "Navi Mumbai") {
        pricing = distancePricing["Navi Mumbai"];
      } else {
        pricing = distancePricing["Delhi"];
      }
      if (pricing && pricing[distance] !== undefined) {
        return pricing[distance];
      }
    }
    return 0;
  };

  // Simulated reverse geocoding to fetch a complete formatted address
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`);
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
              setPickup(data.results[0].formatted_address);
              alert("Current Location fetched: " + data.results[0].formatted_address);
            } else {
              alert("Unable to fetch address.");
            }
          } catch (error) {
            alert("Error fetching location: " + error.message);
          }
        },
        (error) => alert("Error fetching location: " + error.message)
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // guard booking behind login
  const handleBookNow = () => {
    const token = localStorage.getItem("token");           
    if (!token) {                                          
      setAuthError("Please register and log in first to book a driver."); 
      return;                                              
    }
    //  Clear any previous error
    setAuthError("");
    // Proceed with booking...
    const bookingDetails = { pickup, destination, tripType, hours, distance, date, time, totalAmount };
    console.log("Booking:", bookingDetails);
    alert(`Booking confirmed for ₹ ${totalAmount}`);
    // navigate("/dashboard/bookings");
  };


  // Recalculate fare when relevant data changes
  useEffect(() => {
    if (pickup && destination) {
      const fare = calculateFare();
      setTotalAmount(fare);
    }
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
              <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                {[...Array(12).keys()].map((h) => (
                  <option key={h + 1} value={h + 1}>
                    {h + 1} Hour(s)
                  </option>
                ))}
              </select>
            ) : (
              <select value={distance} onChange={(e) => setDistance(Number(e.target.value))}>
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
            <button className="fetch-location-btn" onClick={fetchCurrentLocation}>
              Use Current Location
            </button>

            <input
              type="text"
              placeholder="Enter Destination Address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <div className="date-time-container">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="right-section">
            <h3>User Details</h3>
            <p>Name: {user.name}</p>
            <p>Phone: {user.phone}</p>
            <h2>₹ {totalAmount}</h2>

            {/* ✅ Inline auth error message */}
          {authError && <p className="error-message">{authError}</p>}  {/* ✅ */}

            {/* ✅ Disable button if not logged in */}
            <button className="book-now-btn"  onClick={handleBookNow}  disabled={!localStorage.getItem("token")} >  Book Now </button>
            <p className="price-note">
            For distances above 80 km, an additional charge of 10rs per km will be applied along with food, accommodation, and convenience charges. Night charges will be added if an overnight stay is required.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourlyDriver;
