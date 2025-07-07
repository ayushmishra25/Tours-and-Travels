// src/admin/pages/SupportComplaints.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SupportComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [responses, setResponses] = useState({}); // for resolution text inputs

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/support`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            Accept: "application/json",
          },
        });

        let items = response.data;
        if (Array.isArray(items[0])) items = items[0];

        const normalized = items.map((c) => ({
          id: c.id,
          role: c.role === 1 ? "Driver" : "User",
          name: c.name,
          email: c.email,
          contact: c.contact || "",
          problem: c.problem,
          date: c.date,
          resolved: c.resolved,
          resolution: c.resolution || "",
          disabled: c.resolved,
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
    const complaint = complaints.find((c) => c.id === id);
    if (complaint.resolved) return;

    try {
      await axios.put(
        `${baseURL}/api/support-requests/${id}/resolve`,
        { is_resolved: true },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedComplaints = complaints.map((c) =>
        c.id === id ? { ...c, resolved: true, disabled: true } : c
      );
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error("Error updating resolved status:", error);
      setErrorMsg("Failed to update complaint status. Please try again.");
    }
  };

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendResponse = async (id) => {
    const message = responses[id]?.trim();
    if (!message) {
      alert("Please enter a resolution message before sending.");
      return;
    }

    try {
      await axios.put(
        `${baseURL}/api/support`,
        { id: id, resolution: message },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      const updated = complaints.map((c) =>
        c.id === id ? { ...c, resolution: message } : c
      );
      setComplaints(updated);
      alert("Resolution sent successfully.");
    } catch (error) {
      console.error("Error sending resolution:", error);
      alert("Failed to send resolution. Try again.");
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
              <th>Resolution</th>
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
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <textarea
                      value={responses[complaint.id] || complaint.resolution || ""}
                      onChange={(e) =>
                        handleResponseChange(complaint.id, e.target.value)
                      }
                      rows={2}
                      placeholder="Write resolution here..."
                      disabled={complaint.disabled}
                      style={{ resize: "none", width: "200px" }}
                    />
                    <button
                      onClick={() => handleSendResponse(complaint.id)}
                      disabled={complaint.disabled}
                      style={{
                        marginTop: "5px",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      Send
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={complaint.resolved}
                    onChange={() => toggleResolved(complaint.id)}
                    disabled={complaint.disabled}
                    title={
                      complaint.disabled
                        ? "Already resolved"
                        : "Click to mark resolved"
                    }
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
