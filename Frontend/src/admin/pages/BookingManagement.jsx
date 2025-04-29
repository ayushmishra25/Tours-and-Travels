// src/admin/pages/BookingManagement.jsx
import React, { useState, useEffect } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [assignForms, setAssignForms] = useState({}); // track which booking id is showing form
  const [formData, setFormData] = useState({});

  // Simulate fetching bookings
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBookings([
      // Today's bookings
      { id: 1, userName: 'John Doe', userContact: '+91 9876543210', date: today, time: '10:00', type: 'Hourly', from: 'Area A', to: 'Area B', driver: null },
      { id: 2, userName: 'Jane Smith', userContact: '+91 9123456780', date: today, time: '14:30', type: 'One-way', from: 'Station', to: 'Mall', driver: null },
      // Earlier bookings
      { id: 3, userName: 'Bob Lee', userContact: '+91 9988776655', date: '2025-04-10', time: '09:00', type: 'Weekly', from: 'Home', to: 'Office', driver: 'Alice Brown', driverContact: '+91 9000000001' },
      { id: 4, userName: 'Alice Green', userContact: '+91 9112233445', date: '2025-04-11', time: '16:00', type: 'Monthly', from: 'City Center', to: 'Airport', driver: 'Bob White', driverContact: '+91 9000000002' },
    ]);
  }, []);

  const todayDate = new Date().toISOString().split('T')[0];
  const todays = bookings.filter(b => b.date === todayDate);
  const earlier = bookings.filter(b => b.date < todayDate);

  const toggleAssignForm = (id) => {
    setAssignForms(prev => ({ ...prev, [id]: !prev[id] }));
    setFormData(prev => ({ ...prev, [id]: { name: '', contact: '', location: '' } }));
  };

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: { ...prev[id], [name]: value } }));
  };

  const submitAssign = (id) => {
    const data = formData[id];
    // TODO: send to backend
    alert(`Driver assigned: ${data.name}`);
    // update booking
    setBookings(prev => prev.map(b => b.id === id ? { ...b, driver: data.name, driverContact: data.contact } : b));
    toggleAssignForm(id);
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
          <input type="text" name="name" placeholder="Driver Name"
            value={formData[b.id]?.name || ''} onChange={e => handleInputChange(b.id, e)} />
          <input type="text" name="contact" placeholder="Driver Contact"
            value={formData[b.id]?.contact || ''} onChange={e => handleInputChange(b.id, e)} />
          <input type="text" name="location" placeholder="Driver Location"
            value={formData[b.id]?.location || ''} onChange={e => handleInputChange(b.id, e)} />
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