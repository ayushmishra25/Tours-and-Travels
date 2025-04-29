// src/admin/pages/PaymentManagement.jsx
import React, { useState, useEffect } from "react";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Dummy data with extended fields
    setPayments([
      {
        id: 1,
        userName: 'John Doe',
        driverName: 'Alice Brown',
        from: 'Area A',
        to: 'Area B',
        date: '2025-04-10',
        serviceType: 'Hourly',
        paidViaUPI: true,
        paymentToDriver: false
      },
      {
        id: 2,
        userName: 'Jane Smith',
        driverName: 'Bob Green',
        from: 'Station',
        to: 'Mall',
        date: '2025-04-11',
        serviceType: 'One-way',
        paidViaUPI: false,
        paymentToDriver: false
      },
      {
        id: 3,
        userName: 'John Doe',
        driverName: 'Alice Brown',
        from: 'Area A',
        to: 'Area B',
        date: '2025-04-10',
        serviceType: 'Hourly',
        paidViaUPI: true,
        paymentToDriver: false
      },
      // ...more entries
    ]);
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
                <th>Service Type</th>
                <th>Paid via UPI</th>
                <th>Payment to Driver</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className={p.paymentToDriver ? 'paid-row' : ''}>
                  <td>{p.id}</td>
                  <td>{p.userName}</td>
                  <td>{p.driverName}</td>
                  <td>{p.from}</td>
                  <td>{p.to}</td>
                  <td>{p.date}</td>
                  <td>{p.serviceType}</td>
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
