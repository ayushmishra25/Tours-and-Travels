import React, { useState, useEffect } from "react";
import DriverNavbar from "../components/DriverNavbar";
import axios from "axios";
import { Helmet } from "react-helmet";

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState({});
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  // Fetch status for one ride by ID
  const fetchRideStatus = async (rideId) => {
    try {
      const res = await axios.get(`${baseURL}/api/driver-rides/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ride = res.data.ride; 
      if (!ride) return;

      setRideStatus((prev) => {
        let status = "notStarted";
        if (ride.payment_received && ride.end_ride) status = "completed";
        else if (ride.end_ride) status = "ended";
        else if (ride.start_ride) status = "started";
        return { ...prev, [rideId]: status };
      });
    } catch (err) {
      console.error(`Error fetching status for ride ${rideId}:`, err);
    }
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const resp = await axios.get(`${baseURL}/api/driver/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rideData = resp.data.rides || [];
        setRides(rideData);

        // Initialize status for each ride to notStarted first
        const initialStatus = {};
        rideData.forEach((ride) => {
          initialStatus[ride.id] = "notStarted";
        });
        setRideStatus(initialStatus);

        // Now for each ride, fetch the current status from backend GET ride API
        await Promise.all(
          rideData.map((ride) => fetchRideStatus(ride.id))
        );
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRides();
    else setLoading(false);
  }, [token, baseURL]);

  // Pass ride.id as booking_id to backend
  const handleStartRide = async (rideId) => {
    if (!rideId) {
      console.error("Missing booking_id for starting ride");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/driver-rides`,
        {
          booking_id: rideId, // ride.id used as booking_id
          payment_type: "cash",
          payment_received: false,
          payment_status: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Ride started or updated:", res.data);
      setRideStatus((prev) => ({ ...prev, [rideId]: "started" }));
    } catch (err) {
      console.error("Failed to start ride:", err.response?.data || err);
    }
  };

  const handleEndRide = async (rideId) => {
    if (!rideId) {
      console.error("Missing booking_id for ending ride");
      return;
    }

    try {
      const res = await axios.put(
        `${baseURL}/api/driver-rides/${rideId}`, // ride.id as booking_id in URL
        {
          end_ride: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Ride ended:", res.data);
      setRideStatus((prev) => ({ ...prev, [rideId]: "ended" }));
    } catch (err) {
      console.error("Failed to end ride:", err.response?.data || err);
    }
  };

  const handlePaymentReceived = async (rideId) => {
  if (!rideId) {
    console.error("Missing booking_id for payment received");
    return;
  }

  try {
    // Step 1: Update payment status
    const res = await axios.put(
      `${baseURL}/api/driver-rides/${rideId}`, // ride.id as booking_id in URL
      {
        payment_received: true,
        payment_status: true,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Payment received updated:", res.data);

    // Step 2: Finalize payment (new API call)
    const finalizeRes = await axios.post(
      `${baseURL}/api/finalize-payment/${rideId}`, // New endpoint
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Payment finalized:", finalizeRes.data);

    // Step 3: Update status in UI
    setRideStatus((prev) => ({ ...prev, [rideId]: "completed" }));
  } catch (err) {
    console.error("Failed to finalize payment:", err.response?.data || err);
  }
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
                    <span>
                      <strong>Date:</strong>{" "}
                      {new Date(ride.date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>Time:</strong> {ride.time}
                    </span>
                    <span>
                      <strong>From:</strong> {ride.pickup}
                    </span>
                    <span>
                      <strong>To:</strong> {ride.destination}
                    </span>
                    <span>
                      <strong>Type:</strong> {ride.type}
                    </span>
                    <span>
                      <strong>Fare:</strong> ₹{ride.fare}
                    </span>
                  </div>

                  <div className="ride-actions">
                    {status === "notStarted" && (
                      <>
                        <button
                          className="start-ride"
                          onClick={() => handleStartRide(ride.id)}
                        >
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
                        <button
                          className="end-ride"
                          onClick={() => handleEndRide(ride.id)}
                        >
                          End Ride
                        </button>
                        <p className="gentle-msg start-msg">
                          Drive safely and responsibly.
                        </p>
                      </>
                    )}

                    {status === "ended" && (
                      <>
                        <button
                          className="start-ride"
                          disabled
                          style={{ visibility: "hidden" }}
                        >
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
