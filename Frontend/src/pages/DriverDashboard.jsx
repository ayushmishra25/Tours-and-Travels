import React, { useState, useEffect } from "react";
import DriverNavbar from "../components/DriverNavbar";

const DriverDashboard = () => {
  // Availability state
  const [isAvailable, setIsAvailable] = useState(false);

  // Scheduling state: list of time slots and new slot details
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start: "", end: "" });

  // Future rides state: accepted rides for the future
  const [futureRides, setFutureRides] = useState([]);

  // Ride requests state (simulate fetching with dummy data)
  const [rideRequests, setRideRequests] = useState([]);

  // Simulate an API call to fetch ride requests dynamically
  useEffect(() => {
    setTimeout(() => {
      setRideRequests([
        { id: 1, pickup: "Downtown", destination: "Airport", time: "10:00 AM" },
        { id: 2, pickup: "Mall", destination: "Station", time: "11:30 AM" },
        { id: 3, pickup: "University", destination: "Hospital", time: "1:00 PM" },
      ]);
    }, 1000);

    // Simulate fetching accepted future rides (scheduling details)
    setTimeout(() => {
      setFutureRides([
        { id: 1, date: "2025-03-25", time: "10:00 AM", pickup: "Area A", destination: "Area B" },
        { id: 2, date: "2025-03-26", time: "2:00 PM", pickup: "Area C", destination: "Area D" },
      ]);
    }, 1000);
  }, []);

  const toggleAvailability = () => {
    setIsAvailable((prev) => !prev);
  };

  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (newSlot.date && newSlot.start && newSlot.end) {
      setTimeSlots([...timeSlots, newSlot]);
      setNewSlot({ date: "", start: "", end: "" });
    }
  };

  const handleAcceptRequest = (id) => {
    const accepted = rideRequests.find((req) => req.id === id);
    setRideRequests(rideRequests.filter((req) => req.id !== id));
    // In a real app, accepted ride details would be added to future rides schedule dynamically
    setFutureRides([...futureRides, {
      id: accepted.id,
      date: new Date().toISOString().split("T")[0],
      time: accepted.time,
      pickup: accepted.pickup,
      destination: accepted.destination
    }]);
    alert(`Ride request from ${accepted.pickup} accepted!`);
  };

  const handleDeclineRequest = (id) => {
    setRideRequests(rideRequests.filter((req) => req.id !== id));
    alert("Ride request declined.");
  };

  return (
    <>
      <DriverNavbar />
      <div className="driver-dashboard-container">
        <h1>Driver Dashboard</h1>

        {/* Availability Section */}
        <section className="availability-section">
          <h2>Availability</h2>
          <button onClick={toggleAvailability} className="availability-btn">
            {isAvailable ? "Set Unavailable" : "Set Available"}
          </button>
          <p>
            Status: <strong>{isAvailable ? "Available" : "Unavailable"}</strong>
          </p>
        </section>

        {/* Scheduling Section */}
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
              placeholder="endtime"
              type="time"
              name="end"
              value={newSlot.end}
              onChange={handleNewSlotChange}
              required
            />
            <button type="submit">Add Time Slot</button>
          </form>
          <div className="slots-list">
            {timeSlots.length === 0 ? (
              <p>No working time slots added yet.</p>
            ) : (
              <ul>
                {timeSlots.map((slot, index) => (
                  <li key={index}>
                    Date: {slot.date}, From: {slot.start} to {slot.end}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Future Rides Section */}
          <div className="future-rides">
            <h3>Future Ride Details</h3>
            {futureRides.length === 0 ? (
              <p>No future rides scheduled.</p>
            ) : (
              <ul>
                {futureRides.map((ride) => (
                  <li key={ride.id}>
                    Date: {ride.date}, Time: {ride.time}, From: {ride.pickup} to {ride.destination}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Ride Requests Section */}
        <section className="ride-requests-section">
          <h2>Ride Requests</h2>
          {rideRequests.length === 0 ? (
            <p>No ride requests at the moment.</p>
          ) : (
            <ul>
              {rideRequests.map((req) => (
                <li key={req.id} className="ride-request-item">
                  <p>
                    <strong>Pickup:</strong> {req.pickup}
                  </p>
                  <p>
                    <strong>Destination:</strong> {req.destination}
                  </p>
                  <p>
                    <strong>Time:</strong> {req.time}
                  </p>
                  <div className="request-buttons">
                    <button onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                    <button onClick={() => handleDeclineRequest(req.id)}>Decline</button>
                  </div>
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
