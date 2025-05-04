import React, { useState, useEffect } from "react";
import DriverNavbar from "../components/DriverNavbar";
import axios from "axios";

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const resp = await axios.get(
          "http://localhost:8000/api/driver/rides",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRides(resp.data.rides || []);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRides();
    else setLoading(false);
  }, [token]);

  return (
    <>
      <DriverNavbar />
      <div className="rides-page">
        <h1>My Rides</h1>

        {loading ? (
          <p className="loading">Loading your ride history…</p>
        ) : !token ? (
          <p className="error-message">Please log in to view your rides.</p>
        ) : rides.length === 0 ? (
          <p className="no-rides">You have no rides yet.</p>
        ) : (
          <div className="rides-list">
            {rides.map((ride) => (
              <div key={ride.id} className="ride-card">
                <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {ride.time}</p>
                <p><strong>From:</strong> {ride.pickup}</p>
                <p><strong>To:</strong> {ride.destination}</p>
                <p><strong>Type:</strong> {ride.type}</p>
                <p><strong>Fare:</strong> ₹{ride.fare}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DriverRides;
