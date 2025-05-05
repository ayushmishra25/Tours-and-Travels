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

        // Base URL should end without slash, unless you ensure it in env file
        const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

        const response = await axios.get(`${baseURL}/api/bookings/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Raw API response:", response.data);

        // Laravel returns: { bookings: [...] }
        const data = response.data.bookings;

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.warn("Unexpected API format");
          setBookings([]);
        }

      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <li key={booking.id || index}>
              <strong>{booking.booking_type}</strong> — From <strong>{booking.source_location}</strong> to <strong>{booking.destination_location}</strong> — <span>{new Date(booking.booking_datetime).toLocaleString()}</span>
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
