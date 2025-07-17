import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import AdminNavbar from "../admin/components/AdminNavbar";

const DriverEarningOnAdmin = () => {
  const [earningsList, setEarningsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { driverId } = useParams(); // From route: /driver-earnings/:driverId
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/driver-earning-records/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const records = res.data?.records || [];
        setEarningsList(records);
      } catch (err) {
        console.error("Error fetching driver's earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && driverId) fetchEarnings();
  }, [token, driverId, baseURL]);

  const confirmDriverPayment = async (earningId) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/admin-confirm-driver-payment/${earningId}`,
        { earning_id: earningId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message || "Driver payment confirmed.");
      // Refresh the list
      const updatedList = earningsList.map((e) =>
        e.id === earningId ? { ...e, admin_approved: true, driver_settled: true } : e
      );
      setEarningsList(updatedList);
    } catch (err) {
      console.error("Admin confirm error:", err);
      alert(err.response?.data?.message || "Failed to confirm payment.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <Helmet>
        <title>Driver Earnings Summary</title>
      </Helmet>

      <div className="admin-earnings-container">
        <h1>Driver Earnings Summary</h1>
        {loading ? (
          <p className="loading">Loading earnings data…</p>
        ) : earningsList.length === 0 ? (
          <p>No earnings data available.</p>
        ) : (
          <div className="earnings-table-wrapper">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Cash to Driver</th>
                  <th>UPI to Company</th>
                  <th>Company Share</th>
                  <th>Driver Share</th>
                  <th>Driver Paid?</th>
                  <th>Admin Approved?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {earningsList.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.booking_id}</td>
                    <td>{e.payment_type}</td>
                    <td>₹{Number(e.driver_earning ?? 0).toFixed(2)}</td>
                    <td>₹{Number(e.comapny_earning ?? 0).toFixed(2)}</td> {/* typo kept as-is */}
                    <td>₹{Number(e.company_share ?? 0).toFixed(2)}</td>
                    <td>₹{Number(e.driver_share ?? 0).toFixed(2)}</td>
                    <td>{e.driver_paid ? "✅" : "❌"}</td>
                    <td>{e.admin_approved ? "✅" : "❌"}</td>
                    <td>
                      {((e.payment_type === "cash" && e.driver_paid && !e.admin_approved) ||
                        (e.payment_type === "upi" && !e.admin_approved)) && (
                        <button onClick={() => confirmDriverPayment(e.id)}>
                          {e.payment_type === "upi" ? "Approve UPI" : "Confirm Payment"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default DriverEarningOnAdmin;
