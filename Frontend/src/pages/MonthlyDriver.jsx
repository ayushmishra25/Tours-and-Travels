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
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", phone: "N/A" };

  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupPincode, setpickupPincode] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [workingDays, setWorkingDays] = useState("22");
  const [workingHours, setWorkingHours] = useState("8");
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [authError, setAuthError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

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

  const fetchCurrentLocation = () => {
    setGeoLoading(true);
    setGeoError("");

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await axios.get(`${baseURL}/api/geocode?latlng=${latitude},${longitude}`);

          if (response.data.status === "OK" && response.data.results.length > 0) {
            const fullAddress = response.data.results[0].formatted_address;
            const addressComponents = response.data.results[0].address_components;

            const pincodeObj = addressComponents.find((component) =>
              component.types.includes("postal_code")
            );
            const pincode = pincodeObj ? pincodeObj.long_name : "";

            setPickupLocation(fullAddress);
            setpickupPincode(pincode);
          } else {
            setGeoError("Could not retrieve address from coordinates.");
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error.message);
          setGeoError("Failed to retrieve location address.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        setGeoError("Failed to fetch current location.");
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleBookNow = async () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      setFieldError("");
      return;
    }

    if (!location || !workingDays || !workingHours || !date || !pickupLocation) {
      setFieldError("All fields are required");
      return;
    }

    setAuthError("");
    setFieldError("");

    const now = new Date();
    const hours24 = now.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const formattedDatetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${hours12}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`;

    const bookingData = {
      zone: location,
      booking_type: "Monthly",
      trip_type: "M",
      source_location: pickupLocation,
      vehicle_details: vehicleDetails,
      source_pincode: pickupPincode,
      hours: null,
      working_days: parseInt(workingDays),
      working_hours_per_day: parseInt(workingHours),
      start_date: date,
      booking_datetime: formattedDatetime,
    };

    try {
      const response = await axios.post(`${baseURL}/api/bookings`, bookingData, {
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
          bookingType: booking.booking_type,
          tripType: booking.trip_type,
          bookingDatetime: booking.booking_datetime,
          totalAmount,
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
              Pickup Address:
              <input
                type="text"
                placeholder="Enter Pickup Address"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Pickup Area Pincode"
                value={pickupPincode}
                onChange={(e) => setpickupPincode(e.target.value)}
              />
                <button
                type="button"
                onClick={fetchCurrentLocation}
                style={{
                  marginTop: "6px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
                >
                Get Current Location
                </button>
                {geoLoading && <p>Fetching your current location...</p>}
                {geoError && <p className="error-message">{geoError}</p>}
              </label>
              <label>
                Vehicle Details:
                <input
                  type="text"
                  placeholder="Enter Vehicle Name"
                  value={vehicleDetails}
                  onChange={(e) => setVehicleDetails(e.target.value)}
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
            Please note: ₹ 4000 will be charged for 11 months of monthly driver services. 
            You may cancel your ride up to one hour before the scheduled start time without any charge. Cancellations made within one hour of service will incur a ₹100 fee.  
            For long-distance travel, accommodation, food, and night stays, extra charges apply. An additional service charge of ₹120 per hour will apply for extended hours. For services provided after 10:00 PM, a night charge of ₹200 will be applicable. 
            The mentioned amount is the starting price. Final charges may vary based on your specific requirements and service duration.
            We understand that every requirement is unique, Once you submit your request, we will contact you soon to discuss the details.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyDriver;
