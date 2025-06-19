import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import AdminNavbar from "../admin/components/AdminNavbar";

const UserRidesOnAdmin = () => {
  const [bookings, setBookings] = useState([]);

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
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
        console.error("Error fetching user bookings:", error);
        setBookings([]);
      }
    };

    if (userId) {
      fetchUserBookings();
    }
  }, [userId]);

  const renderBookingDetails = (booking) => {
    const dt = new Date(booking.booking_datetime).toLocaleString();
    switch (booking.booking_type) {
      case "Hourly":
        return (
          <>
            <span>Trip: <strong>{booking.trip_type}</strong></span> —
            <span> Hours: {booking.hours}</span> —
            <span> From {booking.source_location}</span> —
            <span> To {booking.destination_location}</span> —
            <span> Payment: ₹{booking.payment}</span> —
            <span> {dt}</span>
          </>
        );
      case "Weekly":
        return (
          <>
            <span>Trip: <strong>{booking.trip_type}</strong></span> -
            <span> Total Hours: {booking.hours}</span> -
            <span> From {booking.source_location}</span> -
            <span> To {booking.destination_location}</span> -
            <span> Start Date: {booking.start_date}</span> -
            <span> Payment: ₹{booking.payment}</span> -
            <span> {dt}</span>
          </>
        );
      case "Monthly":
        return (
          <>
            <span>Zone: <strong>{booking.zone}</strong></span> —
            <span> Vehicle: {booking.vehicle_details}</span> —
            <span> Working Days: {booking.working_days}</span> —
            <span> Hours/Day: {booking.working_hours_per_day}</span> —
            <span> Start Date: {booking.start_date}</span> —
            <span> Payment: ₹{booking.payment}</span> —
            <span> {dt}</span>
          </>
        );
      case "On demand":
      case "Ondemand":
        return (
          <>
            <span>Trip: one-way</span> —
            <span> From <strong>{booking.source_location}</strong></span> —
            <span> To <strong>{booking.destination_location}</strong></span> —
            <span> Distance: {booking.distance} km</span> —
            <span> {dt}</span>
          </>
        );
      default:
        return (
          <>
            <span>From <strong>{booking.source_location}</strong></span> —
            <span> To <strong>{booking.destination_location}</strong></span> —
            <span> {dt}</span>
          </>
        );
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="user-bookings-container">
      <Helmet>
        <title>User Rides</title>
      </Helmet>
      <h2>User Ride Details</h2>
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
                <strong>{booking.booking_type}</strong> — {renderBookingDetails(booking)}
              </div>
            </li>
          ))
        ) : (
          <li>No rides found for this user.</li>
        )}
      </ul>
    </div>
    </>
  );
};

export default UserRidesOnAdmin;