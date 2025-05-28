import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";

const DriverDashboard = () => {
  const driverId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [isAvailable, setIsAvailable] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start: "", end: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!driverId || !token) {
        setErrorMsg("Driver not authenticated.");
        setIsLoading(false);
        return;
      }

      try {
        // ✅ Get current availability status
        const availabilityRes = await axios.get(`${BASE_URL}/api/drivers/${driverId}/toggle-availability`, { headers });
        setIsAvailable(availabilityRes.data.available === "Active");

        // ✅ Get time slots
        const slotsRes = await axios.get(`${BASE_URL}/api/drivers/${driverId}/slots`, { headers });
        setTimeSlots(slotsRes.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setErrorMsg("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [driverId, token]);

  const toggleAvailability = async () => {
    if (!isAvailable) {
      // Going from Inactive ➝ Active: Fetch location
      if (!navigator.geolocation) {
        setErrorMsg("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            // Step 1: Reverse Geocoding
            const locationRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationRes.json();
            const location = locationData.display_name;

            // Step 2: Send location + toggle request
            const res = await axios.post(
              `${BASE_URL}/api/drivers/${driverId}/toggle-availability`,
              { latitude, longitude, location },
              { headers }
            );

            setIsAvailable(res.data.available === "Active");
          } catch (error) {
            console.error("Error toggling availability:", error);
            setErrorMsg("Failed to toggle availability. Please try again.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMsg("Please turn on your location, refresh the page, and try again.");
        }
      );
    } else {
      // Going from Active ➝ Inactive: Just toggle
      try {
        const res = await axios.post(
          `${BASE_URL}/api/drivers/${driverId}/toggle-availability`,
          {},
          { headers }
        );
        setIsAvailable(res.data.available === "Active");
      } catch (error) {
        console.error("Error toggling availability:", error);
        setErrorMsg("Failed to toggle availability. Please try again.");
      }
    }
  };

  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/drivers/${driverId}/add-slot`,
        newSlot,
        { headers }
      );
      setTimeSlots((prev) => [...prev, res.data]);
      setNewSlot({ date: "", start: "", end: "" });
    } catch (error) {
      console.error("Error adding slot:", error);
      setErrorMsg("Failed to add time slot. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Driver Dashboard</title>
      </Helmet>

      <DriverNavbar />

      <div className="driver-dashboard-container">
        <h1>Driver Dashboard</h1>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="availability-section">
              <h2>Availability</h2>
              <button onClick={toggleAvailability} className="availability-btn">
                {isAvailable ? "Set Unavailable" : "Set Available"}
              </button>
              <p>Status: <strong>{isAvailable ? "Available" : "Unavailable"}</strong></p>
            </section>

            <section className="scheduling-section">
              <h2>Scheduling</h2>
              <form onSubmit={handleAddSlot} className="slot-form">
                <input type="date" name="date" value={newSlot.date} onChange={handleNewSlotChange} required />
                <input type="time" name="start" value={newSlot.start} onChange={handleNewSlotChange} required />
                <input type="time" name="end" value={newSlot.end} onChange={handleNewSlotChange} required />
                <button type="submit">Add Slot</button>
              </form>
              {timeSlots.length === 0 ? (
                <p>No slots added.</p>
              ) : (
                <ul>
                  {timeSlots.map((s, i) => (
                    <li key={i}>
                      {s.date} {s.start} - {s.end}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default DriverDashboard;
