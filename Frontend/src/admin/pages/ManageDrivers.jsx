import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
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
        setDrivers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setError("Could not fetch drivers.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="manage-drivers-container">
      <h2>Driver Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : drivers.length === 0 ? (
        <p>No drivers found.</p>
      ) : (
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
            {drivers.map((driver) => (
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
      )}
    </div>
  );
};

export default ManageDrivers;
