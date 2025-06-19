
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
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
        const res = await axios.get(`${baseURL}/api/driver-earnings/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        // Convert single-object response to array
        const earningsArray = Array.isArray(data)
          ? data
          : data
          ? [data]
          : [];

        setEarningsList(earningsArray);
      } catch (err) {
        console.error("Error fetching drivers' earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && driverId) fetchEarnings();
  }, [token, driverId, baseURL]);

  return (
    <>
      <AdminNavbar />
      <Helmet>
        <title>Driver Earnings Summary</title>
      </Helmet>
      <DashboardNavbar />

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
                  <th>Driver ID</th>
                  <th>Cash to Driver</th>
                  <th>UPI to Company</th>
                  <th>Company Share (20%)</th>
                  <th>Driver Share (80%)</th>
                </tr>
              </thead>
              <tbody>
                {earningsList.map((d, idx) => (
                  <tr key={d.user_id || idx}>
                    <td>{d.driver_name || d.user_id}</td>
                    <td>₹{(d.total_driver_earning ?? 0).toFixed(2)}</td>
                    <td>₹{(d.total_company_earning ?? 0).toFixed(2)}</td>
                    <td>₹{(d.total_company_share ?? 0).toFixed(2)}</td>
                    <td>₹{(d.total_driver_share ?? 0).toFixed(2)}</td>
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
