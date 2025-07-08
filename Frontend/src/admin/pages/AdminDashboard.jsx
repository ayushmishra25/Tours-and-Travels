import React, { useState } from "react";

const AdminDashboard = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("1");

  const toggleCard = (cardTitle) => {
    setExpandedCard(prev => (prev === cardTitle ? null : cardTitle));
  };
    
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;


  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseURL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          body,
          location,
          role: parseInt(role),
        }),
      });

      if (res.ok) {
        alert("Message sent successfully.");
        setTitle("");
        setBody("");
        setLocation("");
        setRole("1");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      alert("Error sending message.");
      console.error(err);
    }
  };


  const tipsData = [
    {
      title: "User Onboarding Guide",
      summary: "Step-by-step flow to help new users and drivers sign up smoothly.",
      details: `The onboarding process includes:
      1. User Registration: Users can register using mobile number.
      2. Profile Setup: Fill in contact details and location.
      3. Driver Onboarding: Submit license, ID proof, and undergo a background check.
      4. Approval Workflow: Admin verifies documents.
      5. Support: 24x7 support is available via chat and helpline.`
    },
    {
      title: "Pricing Matrix",
      summary: "Reference table for hourly, one-way, and custom packages.",
      details: `Our dynamic pricing model includes:
      - Hourly Rates: calculated based on cities.
      - One-Way Trips: Calculated based on distance, base fare + per-km rate.
      - Packages: Weekly and monthly packages available for regular customers.
      - Driver Incentives: Calculated based on distance, hours, and ratings.
      - Admin Adjustment: Prices can be manually overridden for special cases.`
    },
    {
      title: "Security Best Practices",
      summary: "Recommendations on access control and password policies.",
      details: `Recommended practices:
      - Use JWT with refresh token for session security.
      - Role-based access control for all routes (admin, user, driver).
      - Mandatory strong passwords with 2FA (coming soon).
      - Audit Logs: Track login activity, data access, and admin actions.
      - Data Encryption: All user data encrypted using AES-256.`
    },
    {
      title: "Support FAQs",
      summary: "Common questions from drivers and users, with canned responses.",
      details: `FAQs include:
      - How to raise a complaint?
        > Use Help & Support. Write issue type and submit.
      - What is the payment cycle for drivers?
        > Weekly payments processed every sunday to registered bank account.
      - What if I cancel a ride?
        > Cancellation charges may apply if driver is already in route.`
    }
  ];

  return (
    <div className="admin-dashboard" style={{ padding: "20px" }}>
      <section className="dashboard-section">
        <h2>Quick Links</h2>
        <div className="cards-grid">
          <a href="/admin/drivers" className="card">
            <h3>Manage Drivers</h3>
            <p>Add, edit or deactivate driver profiles.</p>
          </a>
          <a href="/admin/users" className="card">
            <h3>Manage Users</h3>
            <p>View or ban passenger accounts.</p>
          </a>
          <a href="/admin/support-complaints" className="card">
            <h3>Support Tickets</h3>
            <p>Review and resolve incoming issues.</p>
          </a>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Announcements & News</h2>
        <ul className="announcements">
          <li>
            <strong>June 1, 2025:</strong> New build will be up.
          </li>
        </ul>
      </section>

      {/* ✅ Added Message Form Section Below */}
      <section className="dashboard-section">
        <h2>Send Message</h2>
        <form onSubmit={handleSendMessage} style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Message Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Message Body"
            value={body}
            rows={4}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Target Location (e.g., West Delhi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="0">Users</option>
            <option value="1">Drivers</option>
          </select>
          <button type="submit" style={{ padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
            Send Message
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>Admin Tips & Resources</h2>
        <div className="cards-grid small-grid">
          {tipsData.map((tip) => (
            <div key={tip.title}>
              <div className="card" onClick={() => toggleCard(tip.title)} style={{ cursor: "pointer" }}>
                <h3>{tip.title}</h3>
                <p>{tip.summary}</p>
              </div>
              {expandedCard === tip.title && (
                <div className="card details-card" style={{
                  background: "#f9f9f9",
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginTop: "10px",
                  borderRadius: "8px"
                }}>
                  <h4>Detailed Information</h4>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.6" }}>
                    {tip.details}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
