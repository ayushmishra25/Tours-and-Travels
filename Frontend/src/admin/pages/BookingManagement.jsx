import React, { useState, useEffect } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [assignForms, setAssignForms] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

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
  }, []);

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
          b.id === id
            ? {
                ...b,
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

  const toggleMenu = (id) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (booking) => {
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

  const saveEdit = (id) => {
    const updated = editData[id];
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              date: updated.date,
              time: updated.time,
              driverContact: b.driverContact ? updated.driverContact : b.driverContact,
            }
          : b
      )
    );
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const discardEdit = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const renderBooking = (b) => (
    <div key={b.id} className="booking-card">
      <div className="three-dot-menu" onClick={() => toggleMenu(b.id)}>
        &#8942;
        {menuOpen[b.id] && (
          <div className="dropdown-menu">
            <div onClick={() => startEditing(b)}>Edit</div>
          </div>
        )}
      </div>
      <div className="booking-info">
        <p><strong>Customer:</strong> {b.userName}</p>
        <p><strong>Customer Contact Number:</strong> {b.userContact}</p>
        <p><strong>Pickup:</strong> {b.from}</p>
        <p><strong>Destination:</strong> {b.to}</p>
        <p><strong>Booking Type:</strong> {b.booking_type}</p>

        {!editMode[b.id] ? (
          <>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.time}</p>
            {b.driverContact && <p><strong>Driver Contact:</strong> {b.driverContact}</p>}
          </>
        ) : (
          <div className="edit-fields">
            <input type="date" name="date" value={editData[b.id]?.date || ""} onChange={(e) => handleEditChange(b.id, e)} />
            <input type="time" name="time" value={editData[b.id]?.time || ""} onChange={(e) => handleEditChange(b.id, e)} />
            {b.driverContact && (
              <input
                type="text"
                name="driverContact"
                placeholder="Driver Contact"
                value={editData[b.id]?.driverContact || ""}
                onChange={(e) => handleEditChange(b.id, e)}
              />
            )}
            <div className="edit-buttons">
              <button onClick={() => saveEdit(b.id)}>Save</button>
              <button onClick={() => discardEdit(b.id)}>Discard</button>
            </div>
          </div>
        )}
      </div>

      {!b.driverContact && (
        <button className="assign-btn" onClick={() => toggleAssignForm(b.id)}>
          Assign a Driver
        </button>
      )}
      {assignForms[b.id] && (
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
