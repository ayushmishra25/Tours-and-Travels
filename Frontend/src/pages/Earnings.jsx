// src/pages/Earnings.jsx
import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";
import axios from "axios";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/driver/completed-rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming the backend returns only completed rides
        const rides = response.data.rides || [];

        const formatted = rides.map((ride) => ({
          date: new Date(ride.date).toLocaleDateString(),
          rideType: ride.type,
          amount: ride.fare,
          companyShare: Math.round(ride.fare * 0.2), // 20%
        }));

        setEarnings(formatted);
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
      }
    };

    if (token) fetchEarnings();
  }, [token]);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalCompanyShare = earnings.reduce((sum, e) => sum + e.companyShare, 0);

  return (
    <>
      <DriverNavbar />
      <Helmet>
        <title>Driver Earnings</title>
      </Helmet>

      <div className="earnings-container">
        <h1>My Earnings</h1>

        {/* Section 1: Total Earnings */}
        <section className="earnings-summary">
          <h2>Total Amount Received</h2>
          <p className="total-amount">₹{totalEarnings}</p>
        </section>

        {/* Section 2: Payment to Company */}
        <section className="company-share">
          <h2>Amount to be Paid to Company (20%)</h2>
          <p className="company-amount">₹{totalCompanyShare}</p>
        </section>

        {/* Detailed Table */}
        <div className="earnings-table">
          <h3>Ride-wise Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Ride Type</th>
                <th>Amount Received</th>
                <th>Company Share (20%)</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.rideType}</td>
                  <td>₹{e.amount}</td>
                  <td>₹{e.companyShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Earnings;
