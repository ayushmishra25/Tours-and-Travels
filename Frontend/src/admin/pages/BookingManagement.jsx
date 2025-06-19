import React, { useState, useEffect } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [assignForms, setAssignForms] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});
  const [menuOpen, setMenuOpen] = useState({});
  const [selectionState, setSelectionState] = useState({});

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${baseURL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const intervalId = setInterval(fetchBookings, 60000);
    return () => clearInterval(intervalId);
  }, [baseURL]);

  const todayDate = new Date().toISOString().split("T")[0];
  const todays = bookings.filter((b) => {
    const createdAt = b.created_at || b.date;
    const createdAtDate = new Date(createdAt).toISOString().split("T")[0];
    return createdAtDate === todayDate;
  });
  const earlier = bookings.filter((b) => {
    const createdAt = b.created_at || b.date;
    const createdAtDate = new Date(createdAt).toISOString().split("T")[0];
    return createdAtDate < todayDate;
  });

  const toggleAssignForm = (id) => {
    setAssignForms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setFormData((prev) => ({
      ...prev,
      [id]: { name: "", contact: "", location: "" },
    }));
  };

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }));
  };

  const submitAssign = async (id) => {
    const data = formData[id];
    if (!data.contact) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/bookings/${id}/assign-driver`, {
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

      if (!response.ok) throw new Error("Failed to assign driver");

      alert(`Driver assigned: ${data.contact}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, driverContact: data.contact } : b
        )
      );
      toggleAssignForm(id);
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver.");
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (booking) => {
    const ride = booking?.ride;
    if (ride?.start_ride || ride?.start_meter) {
      alert("Cannot edit booking. Ride has already started or meter has started.");
      return;
    }

    setEditMode((prev) => ({ ...prev, [booking.id]: true }));
    setEditData((prev) => ({
      ...prev,
      [booking.id]: {
        date: booking.date,
        time: booking.time,
        driverContact: booking.driverContact || "",
      },
    }));
    setMenuOpen({});
  };

  const handleEditChange = (id, e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }));
  };

  const saveEdit = async (id) => {
    const updated = editData[id];
    try {
      const response = await fetch(`${baseURL}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          booking_datetime: `${updated.date} ${updated.time}:00`,
          driver_contact: updated.driverContact,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update booking:", errorData);
        alert("Failed to update booking.");
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
              ...b,
              date: updated.date,
              time: updated.time,
              driverContact: updated.driverContact || b.driverContact,
            }
            : b
        )
      );

      setEditMode((prev) => ({ ...prev, [id]: false }));
      alert("Booking updated successfully.");
    } catch (error) {
      console.error("Error updating booking:", error);  
      alert("Server error while updating booking.");
    }
  };

  const discardEdit = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const handleSelect = async (id) => {
    try {
      const response = await fetch(`${baseURL}/api/bookings/${id}/select-driver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ is_selected: 1 }),
      });
      if (!response.ok) throw new Error("Failed to select driver");
      setSelectionState((prev) => ({ ...prev, [id]: 'selected' }));
      alert('Driver selected successfully.');
    } catch (error) {
      console.error("Select error:", error);
      alert('Failed to select driver.');
    }
  };

  const handleReject = (id) => {
    setSelectionState((prev) => ({ ...prev, [id]: 'rejected' }));
    toggleAssignForm(id);
  };

  const renderRideInfo = (booking) => {
    const {
      booking_type,
      start_ride,
      end_ride,
      start_meter,
      end_meter,
      driverContact,
    } = booking;

    const isHourly = booking_type?.toLowerCase() === "hourly";
    const isOnDemand = booking_type?.toLowerCase() === "on demand" || booking_type?.toLowerCase() === "ondemand";

    if (!driverContact) {
      return (
        <div className="ride-info" style={{ marginTop: "10px" }}>
          <p style={{ color: "orange" }}>
            <strong>Ride Status:</strong> Driver is not assigned yet.
          </p>
        </div>
      );
    }

    const isValidValue = (val) => val && val !== "N/A";
    return (
      <div className="ride-info" style={{ marginTop: "10px" }}>
        {isHourly && (
          <>  
            {!isValidValue(start_ride) ? (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Driver has not initiated the ride.
              </p>
            ) : (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Ride started at {start_ride}
              </p>
            )}

            {isValidValue(end_ride) && (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Ride ended at {end_ride}
              </p>
            )}
          </>
        )}

        {isOnDemand && (
          <>
            {!isValidValue(start_meter) ? (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Driver has not initiated the ride.
              </p>
            ) : (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Ride started (Meter: {start_meter})
              </p>
            )}

            {isValidValue(end_meter) && (
              <p style={{ color: "orange" }}>
                <strong>Ride Status:</strong> Ride ended (Meter: {end_meter})
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderBooking = (b) => {
    const rideStarted = !!b.ride?.start_ride;
    const isMonthly = b.booking_type?.toLowerCase() === 'monthly';
    const hasDriver = !!b.driverContact;
    const isSelected = selectionState[b.id] === 'selected';

    return (
      <div
        key={b.id}
        className="booking-card"
        style={{
          border: "1px solid #ccc",
          marginBottom: "1rem",
          padding: "1rem",
          opacity: b.deleted_by_customer ? 0.6 : 1,
        }}
      >
        {!b.deleted_by_customer && !rideStarted && (
          <div
            className="three-dot-menu"
            onClick={() => toggleMenu(b.id)}
            style={{ cursor: "pointer" }}
          >
            &#8942;
            {menuOpen[b.id] && (
              <div
                className="dropdown-menu"
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  padding: "5px",
                }}
              >
                <div onClick={() => startEditing(b)}>Edit</div>
                {isMonthly && hasDriver && (
                  <>
                    <div
                      onClick={() => handleSelect(b.id)}
                      style={{
                        color: isSelected ? 'gray' : 'initial',
                        pointerEvents: isSelected ? 'none' : 'auto',
                      }}
                    >
                      Selected
                    </div>
                    <div
                      onClick={() => !isSelected && handleReject(b.id)}
                      style={{
                        color: isSelected ? 'gray' : 'initial',
                        pointerEvents: isSelected ? 'none' : 'auto',
                      }}
                    >
                      Rejected
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="booking-info">
          <p><strong>Customer:</strong> {b.userName}</p>
          <p><strong>Customer Contact Number:</strong> {b.userContact}</p>
          <p><strong>Pickup:</strong> {b.from}</p>
          <p><strong>Destination:</strong> {b.to}</p>
          <p><strong>Booking Type:</strong> {b.booking_type}</p>
          <p><strong>Vehicle Details:</strong> {b.vehicle_details}</p>

          {!editMode[b.id] ? (
            <>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              {b.driverContact && <p><strong>Driver Contact:</strong> {b.driverContact}</p>}
            </>
          ) : (
            <div className="edit-fields">
              <input
                type="date"
                name="date"
                value={editData[b.id]?.date || ""}
                onChange={(e) => handleEditChange(b.id, e)}
              />
              <input
                type="time"
                name="time"
                value={editData[b.id]?.time || ""}
                onChange={(e) => handleEditChange(b.id, e)}
              />
              <input
                type="text"
                name="driverContact"
                placeholder="Driver Contact"
                value={editData[b.id]?.driverContact || ""}
                onChange={(e) => handleEditChange(b.id, e)}
              />
              <div className="edit-buttons">
                <button onClick={() => saveEdit(b.id)}>Save</button>
                <button onClick={() => discardEdit(b.id)}>Discard</button>
              </div>
            </div>
          )}

          {renderRideInfo(b)}
        </div>

        {!b.driverContact && !b.deleted_by_customer && !rideStarted && (
          <button className="assign-btn" onClick={() => toggleAssignForm(b.id)}>
            Assign a Driver
          </button>
        )}

        {assignForms[b.id] && !b.deleted_by_customer && !rideStarted && (
          <div className="assign-form">
            <input
              type="text"
              name="contact"
              placeholder="Driver Contact"
              value={formData[b.id]?.contact || ""}
              onChange={(e) => handleInputChange(b.id, e)}
            />
            <button className="submit-assign" onClick={() => submitAssign(b.id)}>
              Driver Assigned Successfully
            </button>
          </div>
        )}

        {b.deleted_by_customer && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
            The booking is cancelled by customer
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="booking-management-container">
      <h2>Booking Management</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <>  
          <section className="booking-section">
            <h3>Today's Bookings</h3>
            {todays.length === 0 ? <p>No bookings for today.</p> : todays.map(renderBooking)}
          </section>

          <section className="booking-section">
            <h3>Earlier Bookings</h3>
            {earlier.length === 0 ? <p>No earlier bookings.</p> : earlier.map(renderBooking)}
          </section>
        </>
      )}
    </div>
  );
};

export default BookingManagement;
