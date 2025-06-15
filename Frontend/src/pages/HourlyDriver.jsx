import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
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

// Address to city mapping
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
  const [pickupPincode, setpickupPincode] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType] = useState("roundtrip");
  const [hours, setHours] = useState(5);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [authError, setAuthError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || "User not authenticated";

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  // Calculate hourly fare
  const calculateFare = () => {
    if (!pickup || !destination) return 0;
    const city = getCityFromAddress(pickup);
    return hourlyPricing[city]?.[hours - 1] ?? 0;
  };

  // 📍 Get current location and reverse geocode
  const handleGetCurrentLocation = () => {
    setGeoLoading(true);
    setGeoError("");
    if (!navigator.geolocation) {
      setAuthError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || "";
          const pincodeMatch = address.match(/\b\d{6}\b/); // extract 6-digit pincode
          const pincode = pincodeMatch ? pincodeMatch[0] : "";
          setPickup(address);
          setpickupPincode(pincode);
        } catch (error) {
          console.error("Reverse geocoding failed:", error.message);
          setGeoError("Failed to retrieve location address.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setAuthError("Permission denied or error fetching location.");
      }
    );
  };

  const handleBookNow = async () => {
    if (!token) {
      setAuthError("Please register and login first to book a driver.");
      return;
    }

    if (!pickup.trim()) {
      setAuthError("Give pickup address");
      return;
    }

    if (!destination.trim()) {
      setAuthError("Please give destination");
      return;
    }

    if (!/^\d{6}$/.test(pickupPincode)) {
      setAuthError("Pincode must be of 6 digits");
      return;
    }

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
      source_pincode: pickupPincode,
      destination_location: destination,
      hours,
      payment: totalAmount,
      booking_datetime,
    };

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    try {
      const resp = await axios.post(`${baseURL}/api/bookings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { booking } = resp.data;

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Booking Confirmed!", {
            body: `Your booking for ${hours} hour(s) is confirmed. Driver will reach at ${pickup}.`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Booking Confirmed!", {
                body: `Your booking for ${hours} hour(s) is confirmed. Driver will reach at ${pickup}.`,
              });
            }
          });
        }
      }

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
      if (err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else if (err.response) {
        setAuthError(`Booking failed: ${err.response.statusText} (code ${err.response.status})`);
      } else {
        setAuthError("Network error. Please try again later.");
      }
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
    tomorrow.setDate(today.getDate());
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    setMinDate(formatDateLocal(tomorrow));
    setMaxDate(formatDateLocal(nextWeek));
  }, []);

  useEffect(() => {
    setTotalAmount(calculateFare());
  }, [pickup, destination, hours]);

  return (
    <>
      <Helmet>
        <title>Hourly Driver Booking</title>
      </Helmet>

      <DashboardNavbar />
      <div className="hourly-driver-container">
        <div className="booking-form">
          <div className="left-section">
            <h3>Select Hours</h3>
            <select value={hours} onChange={(e) => setHours(+e.target.value)}>
              {[...Array(12).keys()].map((h) => (
                <option key={h + 1} value={h + 1}>
                  {h + 1} Hour(s)
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Pickup Address"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Enter Pickup Area Pincode"
              value={pickupPincode}
              onChange={(e) => setpickupPincode(e.target.value)}
            />

            <button
            onClick={handleGetCurrentLocation}
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

            <input
              type="text"
              placeholder="Enter Destination Address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <div className="date-time-container">
              <input
                type="date"
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
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
              Please note: You may cancel your ride up to one hour before the
              scheduled start time without any charge. Cancellations made within
              one hour of service will incur a ₹100 fee. For distances above 80
              km, an additional charge of ₹10/km will be applied, including
              food, accommodation, and convenience. An additional service charge
              of ₹120 per hour will apply for extended hours. For services
              provided after 10:00 PM, a night charge of ₹200 will be
              applicable. Thank you for your understanding.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourlyDriver;
