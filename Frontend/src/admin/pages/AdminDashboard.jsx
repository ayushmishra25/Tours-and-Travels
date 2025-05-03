// src/admin/pages/AdminDashboard.jsx
import React from "react";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <section className="dashboard-section">
        <h2>Quick Links</h2>
        <div className="cards-grid">
          <a href="/admin/manage-drivers" className="card">
            <h3>Manage Drivers</h3>
            <p>Add, edit or deactivate driver profiles.</p>
          </a>
          <a href="/admin/manage-users" className="card">
            <h3>Manage Users</h3>
            <p>View or ban passenger accounts.</p>
          </a>
          <a href="/admin/settings" className="card">
            <h3>Platform Settings</h3>
            <p>Configure pricing, zones, notifications.</p>
          </a>
          <a href="/admin/support-tickets" className="card">
            <h3>Support Tickets</h3>
            <p>Review and resolve incoming issues.</p>
          </a>
          <a href="/admin/documentation" className="card">
            <h3>Documentation</h3>
            <p>Read API docs, user guides and policies.</p>
          </a>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Announcements & News</h2>
        <ul className="announcements">
          <li>
            <strong>June 1, 2025:</strong> New buid will be up.
          </li>
          
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>Admin Tips & Resources</h2>
        <div className="cards-grid small-grid">
          <div className="card">
            <h3>User Onboarding Guide</h3>
            <p>Step-by-step flow to help new users and drivers sign up smoothly.</p>
          </div>
          <div className="card">
            <h3>Pricing Matrix</h3>
            <p>Reference table for hourly, one-way, and custom packages.</p>
          </div>
          <div className="card">
            <h3>Security Best Practices</h3>
            <p>Recommendations on access control, password policies, and audit logs.</p>
          </div>
          <div className="card">
            <h3>Support FAQs</h3>
            <p>Common questions from drivers and users, with canned responses.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;
