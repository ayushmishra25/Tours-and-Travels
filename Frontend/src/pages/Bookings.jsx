import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("Token or User ID not found in localStorage");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/bookings/${userId}`, {
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

  const handleInvoiceClick = async (bookingId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/driver-rides/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ride = response.data.ride;

      if (ride && ride.payment_received) {
        navigate(`/invoice/${bookingId}`);
      } else {
        alert("Please complete the payment to view the bill.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      alert("First go to payment page and confirm your payment method and make the payment.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Re-fetch bookings from the server to get updated data
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${BASE_URL}/api/bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedBookings = response.data.bookings;
      setBookings(Array.isArray(updatedBookings) ? updatedBookings : []);
      
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel the booking. Please try again.");
    }
  };


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

              <div style={{ display: "flex", alignItems: "center" }}>
                {booking.is_deleted ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>Cancelled</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      title="Cancel Booking"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      ❌
                    </button>

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

                    <button
                      onClick={() => handleInvoiceClick(booking.id)}
                      title="View Bill"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#2e86de",
                        fontWeight: "bold",
                      }}
                    >
                      🧾
                    </button>
                  </>
                )}
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
