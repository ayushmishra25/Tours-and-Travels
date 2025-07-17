import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";
import axios from "axios";

const Earnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [recordList, setRecordList] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, recordsRes] = await Promise.all([
          axios.get(`${baseURL}/api/driver-earnings/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/driver-earning-records/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setEarningsData(summaryRes.data);
        setRecordList(recordsRes.data?.records || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (token && userId) fetchData();
  }, [token, userId]);

  const handleSettle = async (earningId) => {
    try {
      await axios.post(
        `${baseURL}/api/driver-settle-request`,
        { earning_id: earningId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Marked as paid. Awaiting admin approval.");

      // Re-fetch the updated earnings data
      const recordsRes = await axios.get(`${baseURL}/api/driver-earning-records/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecordList(recordsRes.data?.records || []);

    } catch (err) {
      console.error("Settle error:", err);
      alert("Failed to update payment status.");
    }
  };


  const renderSection = (title, amount) => (
    <div className="earnings-section">
      <h3>{title}</h3>
      <div className="amount-box">₹{Number(amount || 0).toFixed(2)}</div>
    </div>
  );

  const renderStatus = (earning) => {
    if (earning.payment_type === "cash" && earning.company_share > 0) {
      if (earning.driver_settled)
        return <span className="status done">Settled ✅</span>;
      if (earning.admin_approved)
        return <span className="status waiting">Admin Approved ✅</span>;
      if (earning.driver_paid)
        return <span className="status pending">Pending Admin Approval</span>;
      return (
        <button
          className="settle-btn"
          onClick={() => handleSettle(earning.id)}
        >
          Mark as Paid
        </button>
      );
    }

    if (earning.payment_type === "upi") {
      return earning.driver_settled ? (
        <span className="status done">Paid by Company ✅</span>
      ) : (
        <span className="status pending">Pending</span>
      );
    }

    return <span className="status na">N/A</span>;
  };

  return (
    <>
      <Helmet>
        <title>Earnings Summary</title>
      </Helmet>
      <DriverNavbar />
      <div className="earnings-container">
        <h1>Earnings Summary</h1>

        {!earningsData ? (
          <p className="loading">Loading earnings data…</p>
        ) : (
          <>
            <div className="earnings-grid">
              {renderSection(
                "1. Payment Received to Driver (Cash)",
                earningsData.total_driver_earning
              )}
              {renderSection(
                "2. Payment Received to Company (UPI)",
                earningsData.total_company_earning
              )}
            </div>
            <div className="earnings-grid">
              {renderSection(
                "3. Driver to Pay to Company (20% of Cash)",
                earningsData.total_company_share
              )}
              {renderSection(
                "4. Company to Pay to Driver (80% of UPI)",
                earningsData.total_driver_share
              )}
            </div>

            <h2 style={{ marginTop: "2rem" }}>Settlement Status</h2>
            <div className="settlement-table-wrapper">
              <table className="settlement-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Payment Type</th>
                    <th>Company Share</th>
                    <th>Driver Earning</th>
                    <th>Company Earning</th>
                    <th>Driver Share</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recordList.map((record) => (
                    <tr key={record.id}>
                      <td>{record.booking_id}</td>
                      <td>{record.payment_type.toUpperCase()}</td>
                      <td>₹{Number(record.company_share).toFixed(2)}</td>
                      <td>₹{Number(record.driver_earning).toFixed(2)}</td>
                      <td>₹{Number(record.comapny_earning).toFixed(2)}</td>
                      <td>₹{Number(record.driver_share).toFixed(2)}</td>
                      <td>{renderStatus(record)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Earnings;
