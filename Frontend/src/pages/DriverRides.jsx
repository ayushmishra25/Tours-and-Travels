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

    const fetchRideStatus = async (rideId, rideTypeRaw) => {
    try {
      const res = await axios.get(`${baseURL}/api/driver-rides/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ride = res.data.ride;
      if (!ride) return;

      const rideType = rideTypeRaw?.toLowerCase();

      setRideStatus((prev) => {
        let status = "notStarted";

        if (rideType === "on demand") {
          if (ride.payment_received && ride.end_meter) {
            status = "completed";
          } else if (ride.end_meter) {
            status = "ended";
          } else if (ride.start_meter) {
            status = "started";
          }
        } else {
          if (ride.payment_received && ride.end_ride) {
            status = "completed";
          } else if (ride.end_ride) {
            status = "ended";
          } else if (ride.start_ride) {
            status = "started";
          }
        }

        return { ...prev, [rideId]: status };
      });

      setRides((prev) =>
        prev.map((r) =>
          r.id === rideId
            ? {
                ...r,
                start_meter: ride.start_meter ?? r.start_meter,
                end_meter: ride.end_meter ?? r.end_meter,
              }
            : r
        )
      );
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

        const initialStatus = {};
        rideData.forEach((ride) => {
          initialStatus[ride.id] = "notStarted";
        });
        setRideStatus(initialStatus);
        await Promise.all(rideData.map((ride) => fetchRideStatus(ride.id, ride.type)));
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRides();
    else setLoading(false);
  }, [token, baseURL]);

  const updateRideMeter = (rideId, field, value) => {
    setRides((prevRides) =>
      prevRides.map((ride) =>
        ride.id === rideId ? { ...ride, [field]: value } : ride
      )
    );
  };

    const handleStartRide = async (rideId) => {
      const ride = rides.find((r) => r.id === rideId);
      if (!ride) return;

      try {
        const payload = {
          booking_id: rideId,
          payment_type: "cash",
          payment_received: false,
          payment_status: false,
        };

        if (ride.type?.toLowerCase() === "hourly") {
          payload.start_ride = null;
        }

        if (ride.type?.toLowerCase() === "on demand") {
          payload.start_meter = ride.start_meter;
        }

        const res = await axios.put(`${baseURL}/api/driver-rides/${rideId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Ride started or updated:", res.data);
        setRideStatus((prev) => ({ ...prev, [rideId]: "started" }));
      } catch (err) {
        console.error("Failed to start ride:", err.response?.data || err);
      }
    };


    const handleEndRide = async (rideId) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return;

    try {
      const payload = {};

      if (ride.type?.toLowerCase() === "hourly") {
        payload.end_ride = null;
      }

      if (ride.type?.toLowerCase() === "on demand") {
        payload.end_meter = ride.end_meter;
      }

      const res = await axios.put(`${baseURL}/api/driver-rides/${rideId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Ride ended:", res.data);
      setRideStatus((prev) => ({ ...prev, [rideId]: "ended" }));
    } catch (err) {
      console.error("Failed to end ride:", err.response?.data || err);
    }
  };


  const handlePaymentReceived = async (rideId) => {
    try {
      await axios.put(
        `${baseURL}/api/driver-rides/${rideId}`,
        {
          payment_received: true,
          payment_status: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.post(
        `${baseURL}/api/finalize-payment/${rideId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
              const rideType = ride.type?.toLowerCase();

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
                    {["hourly"].includes(rideType) && (
                      <>
                        {status === "notStarted" && (
                          <>
                            <button className="start-ride" onClick={() => handleStartRide(ride.id)}>Start Ride</button>
                            <button className="end-ride" disabled>End Ride</button>
                          </>
                        )}

                        {status === "started" && (
                          <>
                            <button className="start-ride started" disabled>Ride Started</button>
                            <button className="end-ride" onClick={() => handleEndRide(ride.id)}>End Ride</button>
                            <p className="gentle-msg start-msg">Drive safely and responsibly.</p>
                          </>
                        )}
                      </>
                    )}

                    {rideType === "on demand" && (
                      <>
                        <div className="meter-info">
                          <label>
                            <strong>Start Meter:</strong>{" "}
                            {status === "notStarted" ? (
                              <input
                                type="number"
                                placeholder="Enter start meter"
                                value={ride.start_meter ?? ""}
                                onChange={(e) =>
                                  updateRideMeter(ride.id, "start_meter", e.target.value)
                                }
                              />
                            ) : (
                              ride.start_meter ?? "N/A"
                            )}
                          </label>
                          <label>
                            <strong>End Meter:</strong>{" "}
                            {status === "started" ? (
                              <input
                                type="number"
                                placeholder="Enter end meter"
                                value={ride.end_meter ?? ""}
                                onChange={(e) =>
                                  updateRideMeter(ride.id, "end_meter", e.target.value)
                                }
                              />
                            ) : (
                              ride.end_meter ?? "N/A"
                            )}
                          </label>
                        </div>

                        {status === "notStarted" && (
                          <button
                            className="start-ride"
                            onClick={() => handleStartRide(ride.id)}
                            disabled={!ride.start_meter}
                          >
                            Confirm Start Meter
                          </button>
                        )}

                        {status === "started" && (
                          <>
                            <button className="start-ride started" disabled>Ride Started</button>
                            <button
                              className="end-ride"
                              onClick={() => handleEndRide(ride.id)}
                              disabled={!ride.end_meter}
                            >
                              Confirm End Meter
                            </button>
                            <p className="gentle-msg start-msg">
                              Drive Safely.
                            </p>
                            <p className="gentle-msg start-msg">
                              Please enter end meter before ending the ride.
                            </p>
                          </>
                        )}
                      </>
                    )}

                    {status === "ended" && (
                      <>
                        <button className="start-ride" disabled style={{ visibility: "hidden" }}>
                          Start Ride
                        </button>
                        <button className="end-ride ended" disabled>Ride Ended </button>
                        <p className="gentle-msg end-msg">
                          Please collect ₹{ride.fare} from the customer.
                        </p>
                        <button className="payment-received" onClick={() => handlePaymentReceived(ride.id)}>
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
