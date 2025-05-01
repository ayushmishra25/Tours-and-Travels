import React, { useState, useEffect } from "react";
import DriverNavbar from "../components/DriverNavbar";

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start: "", end: "" });

  const [assignedRides, setAssignedRides] = useState([]);
  const [ongoingRides, setOngoingRides] = useState([]);

  useEffect(() => {
    // Simulate fetching assigned rides
    setTimeout(() => {
      setAssignedRides([
        {
          id: 1,
          user: "John Doe",
          contact: "1234567890",
          pickup: "Downtown",
          destination: "Airport",
          date: "2025-05-02",
          time: "10:00 AM",
          type: "Hourly",
        },
        {
          id: 2,
          user: "Jane Smith",
          contact: "9876543210",
          pickup: "Mall",
          destination: "Station",
          date: "2025-05-02",
          time: "12:00 PM",
          type: "Weekly",
        },
      ]);
    }, 1000);

    // Simulate fetching ongoing rides
    setTimeout(() => {
      setOngoingRides([
        {
          id: 1,
          user: "Alice Johnson",
          contact: "1112223333",
          type: "Weekly",
          from: "Area A",
          to: "Area B",
          time: "2:00 PM",
        },
        {
          id: 2,
          user: "Bob Brown",
          contact: "4445556666",
          type: "Monthly",
          from: "Area C",
          to: "Area D",
          time: "4:00 PM",
        },
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

  const handlePaymentConfirmation = (id) => {
    setAssignedRides(assignedRides.filter((ride) => ride.id !== id));
    alert("Payment confirmed and ride removed from assigned rides.");
  };

  return (
    <>
      <DriverNavbar />
      <div className="driver-dashboard-container">
        <h1>Driver Dashboard</h1>

        <section className="availability-section">
          <h2>Availability</h2>
          <button onClick={toggleAvailability} className="availability-btn">
            {isAvailable ? "Set Unavailable" : "Set Available"}
          </button>
          <p>
            Status: <strong>{isAvailable ? "Available" : "Unavailable"}</strong>
          </p>
        </section>

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
              placeholder="End Time"
              type="time"
              name="end"
              value={newSlot.end}
              onChange={handleNewSlotChange}
              required
            />
            <button type="submit">Add Time Slot</button>
          </form>
          <ul>
            {timeSlots.map((slot, index) => (
              <li key={index}>
                Date: {slot.date}, From: {slot.start} to {slot.end}
              </li>
            ))}
          </ul>
        </section>

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
                      <input type="checkbox" onChange={() => handlePaymentConfirmation(ride.id)} /> Paid via Cash
                    </label>
                    <label>
                      <input type="checkbox" onChange={() => handlePaymentConfirmation(ride.id)} /> Paid via UPI
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

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