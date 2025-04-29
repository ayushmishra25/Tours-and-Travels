// src/admin/pages/SupportComplaints.jsx
import React, { useState, useEffect } from "react";

const SupportComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Dummy complaint data
    setComplaints([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
        role: "User",
        problem: "Driver arrived late.",
        date: "2025-04-25",
        resolved: false,
      },
      {
        id: 2,
        name: "Alice Brown",
        email: "alice@example.com",
        contact: "7894561230",
        role: "Driver",
        problem: "Payment not received.",
        date: "2025-04-26",
        resolved: true,
      },
    ]);
  }, []);

  const toggleResolved = (id) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, resolved: !c.resolved } : c
      )
    );
  };

  return (
    <div className="support-complaints-container">
      <h2>Support & Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Role</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Problem</th>
              <th>Date</th>
              <th>Resolved</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.role}</td>
                <td>{complaint.name}</td>
                <td>{complaint.email}</td>
                <td>{complaint.contact}</td>
                <td>{complaint.problem}</td>
                <td>{complaint.date}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={complaint.resolved}
                    onChange={() => toggleResolved(complaint.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupportComplaints;
