import React, { useState, useEffect } from "react";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${baseURL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        setPayments(result.bookings || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const togglePaymentToDriver = async (bookingId, currentStatus, paymentType) => {
    if (paymentType === "upi" && !currentStatus) {
      try {
        const response = await fetch(`${baseURL}/api/driver-rides/${bookingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            payment_received: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to confirm payment");
        }

        // Update local state only on success
        setPayments(prev =>
          prev.map(p =>
            p.id === bookingId ? { ...p, payment_received: true } : p
          )
        );
      } catch (error) {
        console.error("Error confirming payment:", error);
        return;
      }
    }
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
                <th>Assigned Driver Contact</th>
                <th>Pickup</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Booking Type</th>
                <th>Payment Type</th>
                <th>Payment Status</th>
                <th>Confirm Payment (UPI)</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const isCash = p.payment_type === "cash";

                // UPI payment is confirmed only if both fields are true
                const isUpiPaid =
                  p.payment_type === "upi" &&
                  p.payment_status === true &&
                  p.payment_received === true;

                return (
                  <tr key={p.id} className={isUpiPaid ? "paid-row" : ""}>
                    <td>{p.id}</td>
                    <td>{p.userName || "N/A"}</td>
                    <td>{p.driverContact}</td>
                    <td>{p.from}</td>
                    <td>{p.to}</td>
                    <td>{p.date}</td>
                    <td>{p.booking_type}</td>
                    <td>{p.payment_type}</td>
                    <td>
                      {p.payment_status === true && p.payment_received === true
                        ? "✅"
                        : "❌"}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isUpiPaid}
                        disabled={isCash || isUpiPaid}
                        onChange={() =>
                          togglePaymentToDriver(
                            p.id,
                            isUpiPaid,
                            p.payment_type
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
