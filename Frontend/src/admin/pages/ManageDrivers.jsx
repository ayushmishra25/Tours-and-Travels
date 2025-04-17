// src/admin/pages/ManageDrivers.jsx
import React, { useState, useEffect } from "react";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Dummy driver data
    setDrivers([
      { id: 1, name: "Alice Brown", email: "alice@example.com", status: "Active" },
      { id: 2, name: "Bob Green", email: "bob@example.com", status: "Pending" },
      // Add more dummy drivers as needed
    ]);
  }, []);

  return (
    <div className="manage-drivers-container">
      <h2>Driver Management</h2>
      {drivers.length === 0 ? (
        <p>No drivers found.</p>
      ) : (
        <table className="drivers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.email}</td>
                <td>{driver.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDrivers;
