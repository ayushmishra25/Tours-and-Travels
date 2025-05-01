import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverNavbar from "../components/DriverNavbar";

const BASE_URL = "https://your-api.example.com"; // replace with your actual base URL
const driverId = "CURRENT_DRIVER_ID";              // get from auth/context
const token = "AUTH_TOKEN";                        // get from auth/context
const headers = { Authorization: `Bearer ${token}` };

const DriverDashboard = () => {
  // Availability
  const [isAvailable, setIsAvailable] = useState(false);

  // Scheduling
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start: "", end: "" });

  // Rides
  const [assignedRides, setAssignedRides] = useState([]);
  const [ongoingRides, setOngoingRides] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [futureRides, setFutureRides] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Example endpoints; adjust paths as needed
        const [
          assignedRes,
          ongoingRes,
          requestsRes,
          futureRes,
          slotsRes
        ] = await Promise.all([
          axios.get(`${BASE_URL}/drivers/${driverId}/assigned-rides`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/ongoing-rides`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/ride-requests`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/future-rides`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/time-slots`, { headers })
        ]);

        setAssignedRides(assignedRes.data);
        setOngoingRides(ongoingRes.data);
        setRideRequests(requestsRes.data);
        setFutureRides(futureRes.data);
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

  // Handlers
  const toggleAvailability = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/drivers/${driverId}/toggle-availability`,
        {},
        { headers }
      );
      setIsAvailable(res.data.available);
    } catch (error) {
      console.error("Error toggling availability:", error);
      setErrorMsg("Failed to toggle availability. Please try again.");
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
        `${BASE_URL}/drivers/${driverId}/add-slot`,
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

  const handlePaymentConfirmation = (id) => {
    setAssignedRides((prev) => prev.filter((ride) => ride.id !== id));
    alert("Payment confirmed and ride removed from assigned rides.");
  };

  if (isLoading) return <p>Loading dashboard…</p>;
  if (errorMsg)  return <p className="error">{errorMsg}</p>;

  return (
    <>
      <DriverNavbar />
      <div className="driver-dashboard-container">
        <h1>Driver Dashboard</h1>

        {/* Availability */}
        <section className="availability-section">
          <h2>Availability</h2>
          <button onClick={toggleAvailability} className="availability-btn">
            {isAvailable ? "Set Unavailable" : "Set Available"}
          </button>
          <p>Status: <strong>{isAvailable ? "Available" : "Unavailable"}</strong></p>
        </section>

        {/* Scheduling */}
        <section className="scheduling-section">
          <h2>Scheduling</h2>
          <form onSubmit={handleAddSlot} className="slot-form">
            <input
              type="date"
              name="date"
              value={newSlot.date}
              onChange={handleNewSlotChange}
              required
            />
            <input
              type="time"
              name="start"
              value={newSlot.start}
              onChange={handleNewSlotChange}
              required
            />
            <input
              type="time"
              name="end"
              value={newSlot.end}
              onChange={handleNewSlotChange}
              required
            />
            <button type="submit">Add Time Slot</button>
          </form>
          <ul>
            {timeSlots.map((slot, i) => (
              <li key={i}>
                Date: {slot.date}, From: {slot.start} to {slot.end}
              </li>
            ))}
          </ul>
        </section>

        {/* Assigned Rides */}
        <section className="assigned-rides-section">
          <h2>Assigned Rides</h2>
          {assignedRides.length === 0 ? (
            <p>No assigned rides currently.</p>
          ) : (
            <ul>
              {assignedRides.map((ride) => (
                <li key={ride.id} className="assigned-ride-item">
                  <p><strong>User:</strong> {ride.user}</p>
                  <p><strong>Contact:</strong> {ride.contact}</p>
                  <p><strong>Pickup:</strong> {ride.pickup}</p>
                  <p><strong>Destination:</strong> {ride.destination}</p>
                  <p><strong>Date:</strong> {ride.date}</p>
                  <p><strong>Time:</strong> {ride.time}</p>
                  <p><strong>Type:</strong> {ride.type}</p>
                  <div className="payment-confirmation">
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => handlePaymentConfirmation(ride.id)}
                      /> Paid via Cash
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => handlePaymentConfirmation(ride.id)}
                      /> Paid via UPI
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Ongoing Rides */}
        <section className="ongoing-rides-section">
          <h2>Ongoing Rides (Weekly/Monthly)</h2>
          {ongoingRides.length === 0 ? (
            <p>No ongoing rides.</p>
          ) : (
            <ul>
              {ongoingRides.map((ride) => (
                <li key={ride.id} className="ongoing-ride-item">
                  <p><strong>User:</strong> {ride.user}</p>
                  <p><strong>Contact:</strong> {ride.contact}</p>
                  <p><strong>Type:</strong> {ride.type}</p>
                  <p><strong>From:</strong> {ride.from}</p>
                  <p><strong>To:</strong> {ride.to}</p>
                  <p><strong>Time:</strong> {ride.time}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default DriverDashboard;
