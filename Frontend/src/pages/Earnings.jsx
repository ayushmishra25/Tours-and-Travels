// src/pages/Earnings.jsx
import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";
import axios from "axios";

const Earnings = () => {
  const [cashPayments, setCashPayments] = useState([]);
  const [upiPayments, setUpiPayments] = useState([]);
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/driver/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cash = res.data.filter((ride) => ride.paymentMode === "cash");
        const upi = res.data.filter((ride) => ride.paymentMode === "upi");

        setCashPayments(cash);
        setUpiPayments(upi);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      }
    };

    fetchEarnings();
  }, [token]);

  const totalCash = cashPayments.reduce((sum, r) => sum + r.fare, 0);
  const totalUpi = upiPayments.reduce((sum, r) => sum + r.fare, 0);
  const companyFromDriver = totalCash * 0.2;
  const driverFromCompany = totalUpi * 0.8;

  const renderSection = (title, amount) => (
    <div className="earnings-section">
      <h3>{title}</h3>
      <div className="amount-box">₹{amount.toFixed(2)}</div>
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

        <div className="earnings-grid">
          {renderSection("1. Payment Received to Driver (Cash)", totalCash)}
          {renderSection("2. Payment Received to Company (UPI)", totalUpi)}
        </div>
        <div className="earnings-grid">
          {renderSection("3. Driver to Pay to Company (20% of Cash)", companyFromDriver)}
          {renderSection("4. Company to Pay to Driver (80% of UPI)", driverFromCompany)}
        </div>
      </div>
    </>
  );
};

export default Earnings;
