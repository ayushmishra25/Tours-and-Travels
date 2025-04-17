// src/admin/pages/PaymentManagement.jsx
import React, { useState, useEffect } from "react";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Dummy payment data
    setPayments([
      { id: 1, driver: "Alice Brown", amount: 1000, date: "2025-04-10", status: "Paid" },
      { id: 2, driver: "Bob Green", amount: 1200, date: "2025-04-11", status: "Pending" },
      { id: 3, driver: "Bob Green", amount: 1200, date: "2025-04-11", status: "Pending" },
      // Add more dummy payment entries as needed
    ]);
  }, []);

  return (
    <div className="payment-management-container">
      <h2>Payment Management</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Driver</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.driver}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentManagement;
