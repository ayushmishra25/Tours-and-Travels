// src/admin/pages/BookingManagement.jsx
import React, { useState, useEffect } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [assignForms, setAssignForms] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];
  const todays = bookings.filter((b) => b.date === todayDate);
  const earlier = bookings.filter((b) => b.date < todayDate);

  const toggleAssignForm = (id) => {
    setAssignForms((prev) => ({ ...prev, [id]: !prev[id] }));
    setFormData((prev) => ({ ...prev, [id]: { name: "", contact: "", location: "" } }));
  };

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: { ...prev[id], [name]: value } }));
  };

  const submitAssign = async (id) => {
    const data = formData[id];

    try {
      await fetch(`http://localhost:8000/api/bookings/${id}/assign-driver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          driver_name: data.name,
          driver_contact: data.contact,
          driver_location: data.location,
        }),
      });

      alert(`Driver assigned: ${data.name}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                driver: data.name,
                driverContact: data.contact,
              }
            : b
        )
      );
      toggleAssignForm(id);
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver.");
    }
  };

  const renderBooking = (b) => (
    <div key={b.id} className="booking-card">
      <div className="booking-info">
        <p><strong>User:</strong> {b.userName} ({b.userContact})</p>
        <p><strong>Date:</strong> {b.date} <strong>Time:</strong> {b.time}</p>
        <p><strong>Type:</strong> {b.type}</p>
        <p><strong>From:</strong> {b.from} <strong>To:</strong> {b.to}</p>
        {b.driver && <p><strong>Driver:</strong> {b.driver} ({b.driverContact})</p>}
      </div>
      {!b.driver && (
        <button className="assign-btn" onClick={() => toggleAssignForm(b.id)}>
          Assign a Driver
        </button>
      )}
      {assignForms[b.id] && (
        <div className="assign-form">
          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={formData[b.id]?.name || ""}
            onChange={(e) => handleInputChange(b.id, e)}
          />
          <input
            type="text"
            name="contact"
            placeholder="Driver Contact"
            value={formData[b.id]?.contact || ""}
            onChange={(e) => handleInputChange(b.id, e)}
          />
          <input
            type="text"
            name="location"
            placeholder="Driver Location"
            value={formData[b.id]?.location || ""}
            onChange={(e) => handleInputChange(b.id, e)}
          />
          <button className="submit-assign" onClick={() => submitAssign(b.id)}>
            Driver Assigned Successfully
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="booking-management-container">
      <h2>Booking Management</h2>

      <section className="booking-section">
        <h3>Today's Bookings</h3>
        {todays.length === 0 ? <p>No bookings for today.</p> : todays.map(renderBooking)}
      </section>

      <section className="booking-section">
        <h3>Earlier Bookings</h3>
        {earlier.length === 0 ? <p>No earlier bookings.</p> : earlier.map(renderBooking)}
      </section>
    </div>
  );
};

export default BookingManagement;
