import React, { useState, useEffect } from "react";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [baseURL]);

  const togglePaymentToDriver = async (bookingId, currentStatus, paymentType) => {
    if (paymentType === "upi" && !currentStatus) {
      try {
        const response = await fetch(
          `${baseURL}/api/driver-rides/${bookingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ payment_received: true }),
          }
        );

        if (!response.ok) throw new Error("Failed to confirm payment");

        setPayments((prev) =>
          prev.map((p) =>
            p.id === bookingId ? { ...p, payment_received: true } : p
          )
        );
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    }
  };

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      String(p.id).includes(term) ||
      (p.userName || "").toLowerCase().includes(term) ||
      (p.driverContact || "").toLowerCase().includes(term) ||
      (p.from || "").toLowerCase().includes(term) ||
      (p.to || "").toLowerCase().includes(term) ||
      (p.date || "").toLowerCase().includes(term) ||
      (p.booking_type || "").toLowerCase().includes(term) ||
      (p.payment_type || "").toLowerCase().includes(term) ||
      String(p.payment_status).toLowerCase().includes(term)
    );
  });

  return (
    <div className="payment-management-container">
      <h2>Payment Management</h2>
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {filteredPayments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="payments-table-wrapper" style={{ overflowX: "auto" }}>
          <table className="payments-table" style={{ width: "100%", borderCollapse: "collapse" }}>
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
              {filteredPayments.map((p) => {
                const isCash = p.payment_type === "cash";
                const isUpiPaid =
                  p.payment_type === "upi" && p.payment_status && p.payment_received;

                return (
                  <tr key={p.id} style={{ backgroundColor: isUpiPaid ? "#e6ffe6" : "transparent" }}>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.id}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.userName || "N/A"}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.driverContact}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.from}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.to}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.date}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.booking_type}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{p.payment_type}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                      {p.payment_status && p.payment_received ? "✅" : "❌"}
                    </td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isUpiPaid}
                        disabled={isCash || isUpiPaid}
                        onChange={() => togglePaymentToDriver(p.id, isUpiPaid, p.payment_type)}
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
