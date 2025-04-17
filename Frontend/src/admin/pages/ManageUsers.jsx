// src/admin/pages/ManageUsers.jsx
import React, { useState, useEffect } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Populate with dummy user data
    setUsers([
      { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
      // Add more dummy users as needed
    ]);
  }, []);

  return (
    <div className="manage-users-container">
      <h2>User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
