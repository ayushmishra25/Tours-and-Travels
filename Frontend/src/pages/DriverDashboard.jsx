import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverNavbar from "../components/DriverNavbar";

const DriverDashboard = () => {
  const driverId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [isAvailable, setIsAvailable] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start: "", end: "" });
  const [futureRides, setFutureRides] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  const BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!driverId || !token) {
        setErrorMsg("Driver not authenticated.");
        setIsLoading(false);
        return;
      }

      try {
        const [requestsRes, futureRes, slotsRes] = await Promise.all([
          axios.get(`${BASE_URL}/drivers/${driverId}/ride-requests`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/future-rides`, { headers }),
          axios.get(`${BASE_URL}/drivers/${driverId}/slots`, { headers })
        ]);

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
    setNewSlot(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/drivers/${driverId}/add-slot`,
        newSlot,
        { headers }
      );
      setTimeSlots(prev => [...prev, res.data]);
      setNewSlot({ date: "", start: "", end: "" });
    } catch (error) {
      console.error("Error adding slot:", error);
      setErrorMsg("Failed to add time slot. Please try again.");
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/drivers/${driverId}/accept-ride/${id}`,
        {},
        { headers }
      );
      setRideRequests(prev => prev.filter(r => r.id !== id));
      setFutureRides(prev => [...prev, res.data]);
      alert(`Accepted ride from ${res.data.pickup}`);
    } catch (error) {
      console.error("Error accepting ride:", error);
      setErrorMsg("Failed to accept ride. Please try again.");
    }
  };

  const handleDeclineRequest = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/drivers/${driverId}/decline-ride/${id}`,
        { headers }
      );
      setRideRequests(prev => prev.filter(r => r.id !== id));
      alert("Ride declined.");
    } catch (error) {
      console.error("Error declining ride:", error);
      setErrorMsg("Failed to decline ride. Please try again.");
    }
  };

  return (
    <>
      <DriverNavbar />
      <div className="driver-dashboard-container">
        <h1>Driver Dashboard</h1>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {isLoading ? <p>Loading...</p> : (
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
              {timeSlots.length === 0 ? <p>No slots added.</p> : (
                <ul>
                  {timeSlots.map((s, i) => (
                    <li key={i}>{s.date} {s.start} - {s.end}</li>
                  ))}
                </ul>
              )}

              <div className="future-rides">
                <h3>Future Rides</h3>
                {futureRides.length === 0 ? <p>No rides scheduled.</p> : (
                  <ul>
                    {futureRides.map(r => (
                      <li key={r.id}>{r.date} {r.time} {r.pickup} → {r.destination}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="ride-requests-section">
              <h2>Ride Requests</h2>
              {rideRequests.length === 0 ? <p>No requests.</p> : (
                <ul>
                  {rideRequests.map(req => (
                    <li key={req.id} className="ride-request-item">
                      <p><strong>Pickup:</strong> {req.pickup}</p>
                      <p><strong>Destination:</strong> {req.destination}</p>
                      <p><strong>Time:</strong> {req.time}</p>
                      <div className="request-buttons">
                        <button onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                        <button onClick={() => handleDeclineRequest(req.id)}>Decline</button>
                      </div>
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
