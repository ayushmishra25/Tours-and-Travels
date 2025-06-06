import React, { useState, useEffect } from "react";
import DriverNavbar from "../components/DriverNavbar";
import axios from "axios";
import { Helmet } from "react-helmet";

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Track ride states: 'notStarted' | 'started' | 'ended' | 'completed'
  // We'll store this in a state object keyed by rideId
  const [rideStatus, setRideStatus] = useState({});

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const resp = await axios.get(`${baseURL}/api/driver/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(resp.data.rides || []);
        // Initialize rideStatus as 'notStarted' for all rides
        const initialStatus = {};
        (resp.data.rides || []).forEach((ride) => {
          initialStatus[ride.id] = "notStarted";
        });
        setRideStatus(initialStatus);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRides();
    else setLoading(false);
  }, [token]);

  const handleStartRide = (rideId) => {
    setRideStatus((prev) => ({ ...prev, [rideId]: "started" }));
  };

  const handleEndRide = (rideId) => {
    setRideStatus((prev) => ({ ...prev, [rideId]: "ended" }));
  };

  const handlePaymentReceived = (rideId) => {
    setRideStatus((prev) => ({ ...prev, [rideId]: "completed" }));
  };

  return (
    <>
      <DriverNavbar />
      <div className="rides-page">
        <Helmet>
          <title>Driver Rides - My Rides</title>
        </Helmet>
        <h1>My Rides</h1>

        {loading ? (
          <p className="loading">Loading your ride history…</p>
        ) : !token ? (
          <p className="error-message">Please log in to view your rides.</p>
        ) : rides.length === 0 ? (
          <p className="no-rides">You have no rides yet.</p>
        ) : (
          <div className="rides-list">
            {rides.map((ride) => {
              const status = rideStatus[ride.id] || "notStarted";
              return (
                <div key={ride.id} className="ride-card">
                  <div className="ride-details">
                    <span><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</span>
                    <span><strong>Time:</strong> {ride.time}</span>
                    <span><strong>From:</strong> {ride.pickup}</span>
                    <span><strong>To:</strong> {ride.destination}</span>
                    <span><strong>Type:</strong> {ride.type}</span>
                    <span><strong>Fare:</strong> ₹{ride.fare}</span>
                  </div>
                  <div className="ride-actions">
                    {/* Show buttons & messages based on status */}
                    {status === "notStarted" && (
                      <>
                        <button className="start-ride" onClick={() => handleStartRide(ride.id)}>
                          Start Ride
                        </button>
                        <button className="end-ride" disabled>
                          End Ride
                        </button>
                      </>
                    )}

                    {status === "started" && (
                      <>
                        <button className="start-ride started" disabled>
                          Ride Started
                        </button>
                        <button className="end-ride" onClick={() => handleEndRide(ride.id)}>
                          End Ride
                        </button>
                        <p className="gentle-msg start-msg">Drive safely and responsibly.</p>
                      </>
                    )}

                    {status === "ended" && (
                      <>
                        <button className="start-ride" disabled style={{ visibility: "hidden" }}>
                          {/* Hide start ride button */}
                          Start Ride
                        </button>
                        <button className="end-ride ended" disabled>
                          End Ride
                        </button>
                        <p className="gentle-msg end-msg">
                          Please collect ₹{ride.fare} from the customer.
                        </p>
                        <button
                          className="payment-received"
                          onClick={() => handlePaymentReceived(ride.id)}
                        >
                          Payment Received
                        </button>
                      </>
                    )}

                    {status === "completed" && (
                      <p className="ride-completed-msg">Ride Completed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default DriverRides;
