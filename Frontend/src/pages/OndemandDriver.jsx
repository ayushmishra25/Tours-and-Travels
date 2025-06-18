import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import { Helmet } from "react-helmet";

const OndemandDriver = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickupLocation, setPickupLocation ] = useState("");
  const [pickupPincode, setpickupPincode] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [authError, setAuthError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {
    message: "User not authenticated!",
  };

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const pricing = {
    50: 606,
    100: 1115,
    150: 1206,
    200: 1443,
    250: 1670,
    300: 1860,
    350: 2349,
    400: 2570,
    450: 2800,
    500: 3050,
    600: 3529,
    700: 4008,
    800: 4480,
    900: 4962,
    1000: 5435,
    1200: 6400,
  };

  useEffect(() => {
    setTotalAmount(pricing[distance] || 0);
  }, [distance]);

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

    if (!pickupLocation.trim()) {
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
      booking_type: "On demand",
      trip_type: "one-way",
      source_location: pickupLocation,
      source_pincode: pickupPincode,
      destination_location: destination,
      distance: parseFloat(distance),
      booking_datetime: bookingDatetime,
    };

    try {
      const resp = await axios.post(`${baseURL}/api/bookings`, payload, {
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
        <Helmet>
          <title>On-Demand Driver Service</title>
        </Helmet>

        <h1>On-Demand Driver Service</h1>
        <div className="booking-form">
          <div className="left-section">
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
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              >
                <option value="">Select distance</option>
                {Object.keys(pricing).map((km) => (
                  <option key={km} value={km}>
                    {km} km
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label>
              Time:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
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
              Please note: On-demand services may have surge pricing during peak
              hours. Extra charges for food, accommodation, and night stays may
              apply. An additional service charge of ₹120 per hour will apply
              for extended hours. For services provided after 10:00 PM, a night
              charge of ₹200 will be applicable. You may cancel your ride up to
              one hour before the scheduled start time without any charge.
              Cancellations made within one hour of service will incur a ₹100
              fee.
            </p>

            {authError && <p className="error-message">{authError}</p>}
            {!authError && fieldError && (
              <p className="error-message">{fieldError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OndemandDriver;
