import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/listUsers?role=1`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = drivers.filter((driver) => {
      return (
        (driver.name && driver.name.toLowerCase().includes(query)) ||
        (driver.email && driver.email.toLowerCase().includes(query)) ||
        (driver.phone && driver.phone.toString().includes(query)) ||
        (driver.location && driver.location.toLowerCase().includes(query)) ||
        (driver.pincode && driver.pincode.toString().includes(query))
      );
    });

    setFilteredDrivers(results);
  }, [searchQuery, drivers]);

  return (
    <div className="manage-drivers-container" style={{ padding: "20px" }}>
      <h2>Driver Management</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by name, email, phone, location, or pincode"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          margin: "10px 0 20px 0",
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "200%",
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredDrivers.length === 0 ? (
        <p>No drivers found.</p>
      ) : (
        <table className="drivers-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>ID</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Contact</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Location</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id || driver._id}>
                <td style={{ padding: "10px" }}>{driver.id || driver._id}</td>
                <td style={{ padding: "10px" }}>
                  <Link to={`/admin/drivers/${driver.id || driver._id}`}>
                    {driver.name ?? "No Name"}
                  </Link>
                </td>
                <td style={{ padding: "10px" }}>{driver.email ?? "N/A"}</td>
                <td style={{ padding: "10px" }}>{driver.phone ?? "N/A"}</td>
                <td style={{ padding: "10px" }}>{driver.location ?? "N/A"}</td>
                <td style={{ padding: "10px" }}>
                  {driver.is_available ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDrivers;
