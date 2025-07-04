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

  const isValid = (value) =>
    value !== undefined && value !== null && value !== "N/A" && value !== "";

  const getStatusFromRide = (ride) => {
    const type = ride.type?.toLowerCase();

    if (type === "on demand") {
      if (ride.payment_status && isValid(ride.end_meter))
        return "completed";
      if (isValid(ride.end_meter)) return "ended";
      if (isValid(ride.start_meter)) return "started";
    } else {
      if (ride.payment_status && isValid(ride.end_ride))
        return "completed";
      if (isValid(ride.end_ride)) return "ended";
      if (isValid(ride.start_ride)) return "started";
    }

    return "notStarted";
  };

  const fetchRides = async () => {
    try {
      const resp = await axios.get(`${baseURL}/api/driver/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rideData = resp.data.rides || [];
      setRides(rideData);

      const statusMap = {};
      rideData.forEach((ride) => {
        statusMap[ride.id] = getStatusFromRide(ride);
      });

      setRideStatus(statusMap);
    } catch (err) {
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    if (token) {
      fetchRides();
      intervalId = setInterval(fetchRides, 60000);
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, baseURL]);

  const updateRideMeter = (rideId, field, value) => {
    setRides((prev) =>
      prev.map((ride) =>
        ride.id === rideId ? { ...ride, [field]: value } : ride
      )
    );
  };

  const canStartRideNow = (rideDate, rideTime) => {
    if (!rideDate || !rideTime) return false;

    try {
      const [timePart, meridian] = rideTime.trim().split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

      const [year, month, day] = rideDate.split("-").map(Number);
      const rideDateTime = new Date(year, month - 1, day, hours, minutes);

      const now = new Date();
      const allowedStartTime = new Date(rideDateTime.getTime() - 15 * 60 * 1000);

      return now >= allowedStartTime;
    } catch (error) {
      console.error("Invalid date/time parsing:", error);
      return false;
    }
  };

  const canStartOnDemandRide = (ride) => {
    return (
      ride.start_meter &&
      ride.start_meter !== "N/A" &&
      canStartRideNow(ride.date, ride.time)
    );
  };

  const handleStartRide = async (rideId) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return;

    try {
      const payload = { booking_id: rideId };

      if (ride.type?.toLowerCase() === "hourly") payload.start_ride = null;
      if (ride.type?.toLowerCase() === "on demand") payload.start_meter = ride.start_meter;

      await axios.put(`${baseURL}/api/driver-rides/${rideId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchRides();
    } catch (err) {
      console.error("Failed to start ride:", err.response?.data || err);
    }
  };

  const handleEndRide = async (rideId) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return;

    try {
      const payload = {};

      if (ride.type?.toLowerCase() === "hourly") payload.end_ride = null;
      if (ride.type?.toLowerCase() === "on demand") payload.end_meter = ride.end_meter;

      await axios.put(`${baseURL}/api/driver-rides/${rideId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (ride.payment_type !== "cash") {
        await handlePaymentReceived(rideId);
      }

      await fetchRides();
    } catch (err) {
      console.error("Failed to end ride or finalize payment:", err.response?.data || err);
    }
  };

  const handlePaymentReceived = async (rideId) => {
    try {
      await axios.put(
        `${baseURL}/api/driver-rides/${rideId}`,
        { payment_status: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${baseURL}/api/finalize-payment/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchRides(); // Refresh to update rideStatus and hide button
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
              const isAllowedToStart = canStartRideNow(ride.date, ride.time);

              return (
                <div key={ride.id} className="ride-card">
                  <div className="ride-details">
                    <span><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</span>
                    <span><strong>Time:</strong> {ride.time}</span>
                    <span><strong>From:</strong> {ride.pickup}</span>
                    <span><strong>To:</strong> {ride.destination}</span>
                    <span><strong>Type:</strong> {ride.type}</span>
                    <span><strong>Fare:</strong> ₹{ride.fare}</span>
                    <span><strong>Payment Type:</strong> {ride.payment_type}</span>
                  </div>

                  <div className="ride-actions">
                    {rideType === "hourly" && (
                      <>
                        {status === "notStarted" && (
                          <>
                            <button
                              className="start-ride"
                              onClick={() => handleStartRide(ride.id)}
                              disabled={!isAllowedToStart}
                            >
                              Start Ride
                            </button>
                            <button className="end-ride" disabled>End Ride</button>
                            {!isAllowedToStart && (
                              <p className="gentle-msg warning-msg">
                                You can only start this ride within 15 minutes of the scheduled time.
                              </p>
                            )}
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
                                value={ride.start_meter && ride.start_meter !== "N/A" ? ride.start_meter : ""}
                                onChange={(e) =>
                                  updateRideMeter(ride.id, "start_meter", e.target.value)
                                }
                              />
                            ) : (
                              ride.start_meter && ride.start_meter !== "N/A"
                                ? ride.start_meter
                                : "Not Provided"
                            )}
                          </label>
                          <label>
                            <strong>End Meter:</strong>{" "}
                            {status === "started" ? (
                              <input
                                type="number"
                                placeholder="Enter end meter"
                                value={ride.end_meter && ride.end_meter !== "N/A" ? ride.end_meter : ""}
                                onChange={(e) =>
                                  updateRideMeter(ride.id, "end_meter", e.target.value)
                                }
                              />
                            ) : (
                              ride.end_meter && ride.end_meter !== "N/A"
                                ? ride.end_meter
                                : "Not Provided"
                            )}
                          </label>
                        </div>

                        {status === "notStarted" && (
                          <>
                            <button
                              className="start-ride"
                              onClick={() => handleStartRide(ride.id)}
                              disabled={!canStartOnDemandRide(ride)}
                            >
                              Confirm Start Meter
                            </button>
                            {!isAllowedToStart && (
                              <p className="gentle-msg warning-msg">
                                You can only confirm start meter 15 minutes before the scheduled time.
                              </p>
                            )}
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
                              disabled={!ride.end_meter || ride.end_meter === "N/A"}
                            >
                              Confirm End Meter
                            </button>
                            <p className="gentle-msg start-msg">Drive Safely.</p>
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
                        <button className="end-ride ended" disabled>Ride Ended</button>
                        <p className="gentle-msg end-msg">
                          Please collect ₹{ride.fare} from the customer.
                        </p>
                        {ride.payment_type === "cash" && !ride.payment_status && (
                          <button className="payment-received" onClick={() => handlePaymentReceived(ride.id)}>
                            Payment Received
                          </button>
                        )}
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
