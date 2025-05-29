// ManageDrivers.jsx
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
          width: "200%",
        }}
      />

      {loading ? (
        <p className="status-text">Loading...</p>
      ) : error ? (
        <p className="status-text error">{error}</p>
      ) : filteredDrivers.length === 0 ? (
        <p className="status-text">No drivers found.</p>
      ) : (
        <div className="table-container">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id || driver._id}>
                  <td>{driver.id || driver._id}</td>
                  <td>
                    <Link to={`/admin/drivers/${driver.id || driver._id}`}>
                      {driver.name ?? "No Name"}
                    </Link>
                  </td>
                  <td>{driver.email ?? "N/A"}</td>
                  <td>{driver.phone ?? "N/A"}</td>
                  <td>{driver.location ?? "N/A"}</td>
                  <td>{driver.is_available ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageDrivers;
