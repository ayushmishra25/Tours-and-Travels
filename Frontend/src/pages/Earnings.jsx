// src/pages/Earnings.jsx
import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import { Helmet } from "react-helmet";

const Earnings = () => {
  const [earnings, setEarnings] = useState([
    // mock data; replace with real fetch
    { date: "2025-04-28", rideType: "Hourly Trip", amount: 1200 },
    { date: "2025-04-27", rideType: "On-Demand", amount: 650 },
    { date: "2025-04-26", rideType: "Weekly Booking", amount: 5000 },
    { date: "2025-04-25", rideType: "Monthly Salary", amount: 22000 },
  ]);

  const total = earnings.reduce((sum, e) => sum + e.amount, 0);

  // In real usage you'd fetch() here:
  // useEffect(() => { fetch("/api/driver/earnings")... }, []);

  return (
    <>
      <DriverNavbar />
      <div className="earnings-container">
        <h1>My Earnings</h1>


        <div className="earnings-list">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Ride Type</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.rideType}</td>
                  <td>{e.amount}</td>
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
