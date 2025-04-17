// src/admin/pages/BookingManagement.jsx
import React, { useState, useEffect } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Dummy booking data
    setBookings([
      { id: 1, user: "John Doe", driver: "Alice Brown", date: "2025-04-12", amount: 500 },
      { id: 2, user: "Jane Smith", driver: "Bob Green", date: "2025-04-13", amount: 650 },
      // Add more dummy booking entries as needed
    ]);
  }, []);

  return (
    <div className="booking-management-container">
      <h2>Booking Management</h2>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Driver</th>
              <th>Date</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user}</td>
                <td>{booking.driver}</td>
                <td>{booking.date}</td>
                <td>{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingManagement;
