import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/listUsers?role=1`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const fetchedDrivers = response.data.users || [];
        setDrivers(fetchedDrivers);
        setFilteredDrivers(fetchedDrivers);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setError("Could not fetch drivers.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [baseURL]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredDrivers(
      drivers.filter((driver) =>
        [
          driver.name,
          driver.email,
          driver.phone?.toString(),
          driver.location,
          driver.current_location,
          driver.pincode?.toString(),
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      )
    );
  }, [searchQuery, drivers]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleEditClick = (driverId) => {
    navigate(`/driver-details-upload-editable/${driverId}`);
  };

  const handleTripClick = (driverId) => {
    navigate(`/driver-trips-on-admin/${driverId}`);
  };

  return (
    <div className="manage-drivers-container">
      <h2 className="heading">Driver Management</h2>

      <input
        type="text"
        placeholder="Search by name, email, phone, location, or pincode"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          margin: "10px 0 20px 0",
          padding: "10px",
          maxWidth: "400px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "100%", // full width
        }}
      />

      {loading ? (
        <p className="status-text">Loading...</p>
      ) : error ? (
        <p className="status-text error">{error}</p>
      ) : filteredDrivers.length === 0 ? (
        <p className="status-text">No drivers found.</p>
      ) : (
        <table
          className="drivers-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            fontSize: "15px",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact (Copy)</th>
              <th>Location</th>
              <th>Current Location</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Trips</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver, idx) => {
              const id = driver.id || driver._id;
              return (
                <tr key={`${id}-${idx}`} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{id}</td>
                  <td>
                    <Link to={`/admin/drivers/${id}`}>
                      {driver.name ?? "No Name"}
                    </Link>
                  </td>
                  <td>{driver.email ?? "N/A"}</td>
                  <td>
                    {driver.phone ?? "N/A"}
                    {driver.phone && (
                      <button
                        onClick={() => copyToClipboard(driver.phone, id)}
                        style={{
                          marginLeft: "10px",
                          padding: "2px 6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          background: "#007bff",
                          color: "#fff",
                        }}
                      >
                        {copiedId === id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </td>
                  <td>{driver.location ?? "N/A"}</td>
                  <td>{driver.current_location ?? "N/A"}</td>
                  <td>{driver.is_available ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      onClick={() => handleEditClick(id)}
                      style={{
                        paddingLeft: "5px",
                        paddingRight: "40px",
                        fontSize: "15px",
                        cursor: "pointer",
                        border: "1px solid #28a745",
                        borderRadius: "4px",
                        background: "#28a745",
                        color: "#fff",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTripClick(id)}
                      style={{
                        paddingLeft: "5px",
                        paddingRight: "40px",
                        marginRight:"25px",
                        fontSize: "15px",
                        cursor: "pointer",
                        border: "1px solid #28a745",
                        borderRadius: "4px",
                        background: "#28a745",
                        color: "#fff",
                      }}
                    >
                      Trips
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDrivers;
