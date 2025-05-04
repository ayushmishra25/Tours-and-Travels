import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("Token or User ID not found in localStorage");
          return;
        }

        const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

        const response = await axios.get(`${baseURL}/api/booking/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Bookings API Response:", response.data);

        // Safely set bookings, fallback to empty array if undefined
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]); // fallback on error
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <ul>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking.id}>
              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Driver - {booking.details}
            </li>
          ))
        ) : (
          <li>No bookings found.</li>
        )}
      </ul>
    </div>
  );
};

export default Bookings;
