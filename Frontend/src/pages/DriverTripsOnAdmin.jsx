import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import AdminNavbar from "../admin/components/AdminNavbar";

const DriverTripsOnAdmin = () => {
  const { driverId } = useParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
          const res = await axios.get(`${baseURL}/api/admin/driver-rides/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.rides || [];
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch driver trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) fetchTrips();
  }, [driverId, baseURL, token]);

  return (
    <>
      <AdminNavbar />
      <div className="driver-trips-container">
        <Helmet>
          <title>Driver Trips</title>
        </Helmet>
        <h2 className="title">Trips for Driver</h2>

        {loading ? (
          <p className="loading-text">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="no-data-text">No trips found for this driver.</p>
        ) : (
          <div className="trips-list">
            {trips.map((trip) => (
              <div className="trip-card" key={trip.id}>
                <p><strong>Date:</strong> {trip.date}</p>
                <p><strong>Time:</strong> {trip.time}</p>
                <p><strong>Pickup:</strong> {trip.pickup}</p>
                <p><strong>Destination:</strong> {trip.destination}</p>
                <p><strong>Type:</strong> {trip.type}</p>
                <p><strong>Fare:</strong> ₹{trip.fare}</p>
                <p><strong>Payment status:</strong> {trip.payment_status === true ? "Done" : "Not done"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DriverTripsOnAdmin;
