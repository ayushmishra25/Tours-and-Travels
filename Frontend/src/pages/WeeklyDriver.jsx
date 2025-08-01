import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import DashboardNavbar from "../components/DashboardNavbar";
import axios from "axios";

const WeeklyDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupPincode, setpickupPincode] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [authError, setAuthError] = useState(""); 
  const [fieldError, setFieldError] = useState("");
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || "User not authenticated";

  const calculateFare = () => {
    if (!workingDays || !workingHoursPerDay) return 0;
    const days = parseInt(workingDays, 10);
    const hours = parseInt(workingHoursPerDay, 10);
    const baseRateFor12Hours = 1250;
    const ratePerHour = baseRateFor12Hours / 12;
    return Math.round(ratePerHour * hours * days);
  };

  useEffect(() => {
    const fare = calculateFare();
    setTotalAmount(fare);
  }, [location, workingDays, workingHoursPerDay]);

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

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
    setAuthError("");

    if (!location.trim()) {
      setFieldError("Location is required");
      return;
    }
    if (!destinationLocation.trim()) {
      setFieldError("Destination location is required");
      return;
    }
    if (!workingDays) {
      setFieldError("Working days selection is required");
      return;
    }
    if (!workingHoursPerDay) {
      setFieldError("Working hours per day selection is required");
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
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${minute} ${ampm}`;

    const bookingDatetime = `${date} ${formattedTime}`;

    const bookingData = {
      user_id: parseInt(localStorage.getItem("userId")),
      booking_type: "Weekly",
      trip_type: `${workingDays} days`,
      source_location: pickupLocation,
      source_pincode: pickupPincode,
      destination_location: destinationLocation,
      hours: workingDays * workingHoursPerDay,
      working_days: workingDays,
      working_hours_per_day: parseInt(workingHoursPerDay, 10),
      payment: totalAmount,
      start_date: date,
      booking_datetime: bookingDatetime,
    };

    try {
      const response = await axios.post(`${baseURL}/api/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { booking } = response.data;
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
    } catch (error) {
      console.error("Error booking driver:", error);
      setFieldError("An error occurred while booking. Please try again.");
    }
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
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Select Zone</option>
                <option value="Noida">Noida</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Faridabad">Faridabad</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="West Delhi">West Delhi</option>
                <option value="East Delhi">East Delhi</option>
                <option value="South Delhi">South Delhi</option>
                <option value="North Delhi">North Delhi</option>
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
              <input
                type="text"
                placeholder="Enter Pickup Area Pincode"
                value={pickupPincode}
                onChange={(e) => setpickupPincode(e.target.value)}
              />
              <button
                type="button"
                onClick={fetchCurrentLocation}
                disabled={isLocating}
                style={{
                  marginTop: "6px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isLocating ? "not-allowed" : "pointer",
                }}
              >
                {isLocating ? "Getting Location..." : " Use Current Location"}
              </button>
            </label>
            {geoLoading && <p>Fetching your current location...</p>}
            {geoError && <p className="error-message">{geoError}</p>}

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
              Working Hours Per Day:
              <select
                value={workingHoursPerDay}
                onChange={(e) => setWorkingHoursPerDay(e.target.value)}
              >
                <option value="">Select Hours</option>
                {Array.from({ length: 11 }, (_, i) => i + 2).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} Hours
                  </option>
                ))}
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

            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>

            <p className="price-note">
              Please note: You may cancel your ride up to one hour before the scheduled start time without any charge. Cancellations made within one hour of service will incur a ₹100 fee.
              An additional service charge of ₹120 per hour will apply for extended hours. For services provided after 10:00 PM, a night charge of ₹200 will be applicable. Thank you for your understanding.
            </p>

            {authError && <p className="error-message">{authError}</p>}
            {!authError && fieldError && <p className="error-message">{fieldError}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyDriver;
