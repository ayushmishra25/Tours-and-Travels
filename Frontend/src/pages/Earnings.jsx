import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";
import axios from "axios";

const Earnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/driver-earnings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEarningsData(res.data);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      }
    };

    if (token && userId) fetchEarnings();
  }, [token, userId]);

  const renderSection = (title, amount) => (
    <div className="earnings-section">
      <h3>{title}</h3>
      <div className="amount-box">₹{amount?.toFixed(2) || "0.00"}</div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title> Earnings Summary </title>
      </Helmet>
      <DriverNavbar />
      <div className="earnings-container">
        <h1> Earnings Summary </h1>

        {!earningsData ? (
          <p className="loading">Loading earnings data…</p>
        ) : (
          <>
            <div className="earnings-grid">
              {renderSection("1. Payment Received to Driver (Cash)", earningsData.total_driver_earning)}
              {renderSection("2. Payment Received to Company (UPI)", earningsData.total_company_earning)}
            </div>
            <div className="earnings-grid">
              {renderSection("3. Driver to Pay to Company (20% of Cash)", earningsData.total_company_share)}
              {renderSection("4. Company to Pay to Driver (80% of UPI)", earningsData.total_driver_share)}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Earnings;
