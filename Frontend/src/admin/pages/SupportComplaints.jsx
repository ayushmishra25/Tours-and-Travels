// src/admin/pages/SupportComplaints.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SupportComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Optional: include auth if required
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/support",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              Accept: "application/json",
            },
          }
        );

        let items = response.data;
        // flatten nested array
        if (Array.isArray(items[0])) items = items[0];

        const normalized = items.map(c => ({
          id: c.id,
          role: c.role === 1 ? 'Driver' : 'User',
          name: c.name,
          email: c.email,
          contact: c.contact || '',
          problem: c.problem,
          date: c.date,
          resolved:c.resolved,
        }));

        setComplaints(normalized);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setErrorMsg("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [token]);

  const toggleResolved = async (id) => {
    const updatedComplaints = complaints.map((c) => {
      if (c.id === id) {
        return { ...c, resolved: !c.resolved };
      }
      return c;
    });
  
  const updatedComplaint = updatedComplaints.find(c => c.id === id);
  try {
    await axios.put(
      `http://65.0.163.37:8000/api/support-requests/${id}/resolve`,
      { is_resolved: updatedComplaint.resolved },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
      }
    );
    setComplaints(updatedComplaints);
  } catch (error) {
    console.error("Error updating resolved status:", error);
    setErrorMsg("Failed to update complaint status. Please try again.");
  }
};
  

  if (loading) return <p>Loading complaints...</p>;
  if (errorMsg) return <div className="error-message">{errorMsg}</div>;

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
            {complaints.map(complaint => (
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
