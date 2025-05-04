// src/admin/pages/PaymentManagement.jsx
import React, { useState, useEffect } from "react";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://65.0.163.37:8000/api/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        setPayments(result.bookings);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
  
    fetchPayments();
  }, []);
  

  const togglePaymentToDriver = (id) => {
    setPayments(prev => prev.map(p =>
      p.id === id ? { ...p, paymentToDriver: !p.paymentToDriver } : p
    ));
  };

  return (
    <div className="payment-management-container">
      <h2>Payment Management</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Driver</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Booking Type</th>
                <th>Paid via UPI</th>
                <th>Payment to Driver</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className={p.paymentToDriver ? 'paid-row' : ''}>
                  <td>{p.id}</td>
                  <td>{p.userName}</td>
                  <td>{p.driver}</td>
                  <td>{p.from}</td>
                  <td>{p.to}</td>
                  <td>{p.date}</td>
                  <td>{p.booking_type}</td>
                  <td>{p.paidViaUPI ? '✅' : '❌'}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={p.paymentToDriver}
                      onChange={() => togglePaymentToDriver(p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
