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


  const user = JSON.parse(localStorage.getItem("user")) ||  "User not authenticated" ;
  // Function to extract city from the entered location (manual input)
  const getCityFromAddress = (address) => {
    const lower = address.toLowerCase();
    if (lower.includes("hyderabad")) return "Hyderabad";
    if (lower.includes("bangalore") || lower.includes("bengaluru")) return "Bangalore";
    return "others";
  };

  // Calculate fare: if city is Hyderabad/Bangalore daily rate = 1400, else 1250
  const calculateFare = () => {
    if (!workingDays || !workingHoursPerDay) return 0;

    const days = parseInt(workingDays, 10);
    const hours = parseInt(workingHoursPerDay, 10);

    const baseRateFor12Hours = 1250;
    const ratePerHour = baseRateFor12Hours / 12;

    return Math.round(ratePerHour * hours * days); // Final bill
  };

  useEffect(() => {
    const fare = calculateFare();
    setTotalAmount(fare);
  }, [location, workingDays, workingHoursPerDay]);

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
    const bookingDatetime = `${date} ${time}:00`;

    // ▶️ All good—prepare the booking data
    const bookingData = {
      user_id: parseInt(localStorage.getItem("userId")),
      booking_type: "Weekly",
      trip_type: `${workingDays} days`,
      source_location: pickupLocation,
      destination_location: destinationLocation,
      hours: workingDays * workingHoursPerDay,
      working_days: workingDays, // Still fine as is
      working_hours_per_day: parseInt(workingHoursPerDay, 10),
      payment: totalAmount,
      start_date: date,
      booking_datetime: bookingDatetime,
    };

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    try {
      const response = await axios.post(`${baseURL}/api/booking`, bookingData, {
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
            {/* Zone selector */}
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
                onChange={(e) => setPickupPincode(e.target.value)}
              />
            </label>
            {/* New destination field */}
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
              <option value="2"> 2 Hours</option>
              <option value="3"> 3 Hours</option>
              <option value="4"> 4 Hours</option>
              <option value="5"> 5 Hours</option>
              <option value="6"> 6 Hours</option>
              <option value="7"> 7 Hours</option>
              <option value="8"> 8 Hours</option>
              <option value="9"> 9 Hours</option>
              <option value="10">10 Hours</option>
              <option value="11"> 11 Hours</option>
              <option value="12">12 Hours</option>
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
              For each night stay, an extra charge of ₹300 applies, along with food and accommodation costs. Pricing is negotiable; we will contact you soon to confirm the details.
              An additional service charge of ₹120 per hour will apply for extended hours. For services provided after 10:00 PM, a night charge of ₹300 will be applicable. Thank you for your understanding
            </p>

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
