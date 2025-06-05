import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

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
        const response = await axios.get(`${baseURL}/api/bookings/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      <Helmet>
        <title>My Bookings</title>
      </Helmet>
      <h2>My Bookings</h2>
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <li
              key={booking.id || index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
              }}
            >
              <div>
                <strong>{booking.booking_type}</strong> — From{" "}
                <strong>{booking.source_location}</strong> to{" "}
                <strong>{booking.destination_location}</strong> —{" "}
                <span>{new Date(booking.booking_datetime).toLocaleString()}</span>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Link
                  to={`/final-tnc/${booking.id}`}
                  title="View Payment Details"
                  style={{ textDecoration: "none", fontSize: "18px" }}
                >
                  💳
                </Link>

                <Link
                  to={`/assigned-driver/${booking.id}`}
                  title="View Driver Details"
                  style={{ textDecoration: "none", fontSize: "18px" }}
                >
                  👨‍✈️
                </Link>

                <Link
                  to={`/invoice/${booking.id}`}
                  title="View Bill"
                  style={{
                    textDecoration: "none",
                    fontSize: "18px",
                    color: "#2e86de",
                    fontWeight: "bold",
                  }}
                >
                  🧾
                </Link>
              </div>
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
