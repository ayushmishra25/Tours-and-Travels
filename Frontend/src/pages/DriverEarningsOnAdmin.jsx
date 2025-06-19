// File: src/pages/DriverEarningOnAdmin.jsx
import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Helmet } from "react-helmet";
import axios from "axios";

const DriverEarningOnAdmin = () => {
  const [earningsList, setEarningsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAllEarnings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/admin/driver-earnings/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEarningsList(res.data || []);
      } catch (err) {
        console.error("Error fetching drivers' earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllEarnings();
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Driver Earnings Summary</title>
      </Helmet>
      <DashboardNavbar />
      <div className="admin-earnings-container">
        <h1>Drivers' Earnings Summary</h1>
        {loading ? (
          <p className="loading">Loading earnings data…</p>
        ) : earningsList.length === 0 ? (
          <p>No earnings data available.</p>
        ) : (
          <div className="earnings-table-wrapper">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Cash to Driver</th>
                  <th>UPI to Company</th>
                  <th>Company Share (20%)</th>
                  <th>Driver Share (80%)</th>
                </tr>
              </thead>
              <tbody>
                {earningsList.map((d) => (
                  <tr key={d.driver_id}>
                    <td>{d.driver_name}</td>
                    <td>₹{d.total_driver_earning?.toFixed(2) || "0.00"}</td>
                    <td>₹{d.total_company_earning?.toFixed(2) || "0.00"}</td>
                    <td>₹{d.total_company_share?.toFixed(2) || "0.00"}</td>
                    <td>₹{d.total_driver_share?.toFixed(2) || "0.00"}</td>
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
