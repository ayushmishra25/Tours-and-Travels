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
      if (!navigator.geolocation) {
        setErrorMsg("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const locationRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationRes.json();
            const location = locationData.display_name;

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

            {/* 🔗 Quick Links Section */}
            <section className="dashboard-section">
              <h2>Quick Links</h2>
              <div className="cards-grid">
                <a href="/trip-history" className="card">
                  <h3>My Rides</h3>
                  <p>View and manage your ride history and status.</p>
                </a>
                <a href="/earnings" className="card">
                  <h3>Earnings</h3>
                  <p>Track your income and payment summaries.</p>
                </a>
                <a href="/driver-profile" className="card">
                  <h3>Profile</h3>
                  <p>Get your personal details.</p>
                </a>
                <a href="/support" className="card">
                  <h3>Support</h3>
                  <p>Reach out for help or resolve issues quickly.</p>
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default DriverDashboard;
