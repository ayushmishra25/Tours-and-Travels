import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverJobDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const driverId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    console.log("Retrieved driverId from localStorage:", driverId);

    if (!driverId || !token) {
      console.warn("No driverId or token found in localStorage.");
      setLoading(false); // Stop loading if there's no driverId or token
      return;
    }

    const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;


    const checkDriverDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/drivers/${driverId}/details`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Pass the token in the header
          },
        });
        console.log("Driver details response:", response.data);

        if (response.status === 200 && response.data && response.data.detailsExist) {
          navigate("/driver-dashboard"); // Navigate only after the check completes
        } else {
          setLoading(false); // If details do not exist, stop loading
        }
      } catch (error) {
        console.error("Error checking driver details:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    checkDriverDetails();
  }, [navigate]);

  const handleAgree = () => {
    localStorage.setItem("driverAgreed", "true");
    navigate("/driver-details-upload");
  };

  const handleDisagree = () => {
    navigate(-1);
  };

  // Show loading spinner or loading message while fetching details
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-details-container">
      <h1>Driver Job Details</h1>

      <section className="company-info">
        <h2>Company Overview</h2>
        <p>
          Our company was established in 2025 with the objective of providing better services to customers through reliable drivers while offering maximum employment opportunities to drivers. Our journey began with a commitment to ensuring safe, efficient, and reliable service to our clients, and this legacy continues to drive our everyday operations.
        </p>
      </section>

      <section className="booking-info">
        <h2>Job Opportunities & Bookings</h2>
        <p>
          We offer part-time work where various types of bookings appear on your panel. You can choose bookings according to your preference. Drivers without complaints get more opportunities.
        </p>
        <p>We offer four types of services:</p>
        <ul>
          <li><strong>Hourly Bookings</strong>: Round trips for 1 to 12 hours or one-way trips of 1 to 80 KM.</li>
          <li><strong>Weekly Bookings</strong>: Engage as a salaried driver for the week.</li>
          <li><strong>Monthly Bookings</strong>: Engage as a salaried driver for the month.</li>
          <li><strong>On-Demand Bookings</strong>: Round trips for 1 to 12 hours or one-way trips of 1 to 80 KM.</li>
        </ul>
        <p>
          The company commission on local and outstation bookings ranges from 20% to 10% (applied on the remaining bill after GST deduction). Overtime is also charged, and a night charge of Rs 200 is applied for driving at night.
        </p>
      </section>

      <section className="driver-responsibilities">
        <h2>Driver Responsibilities & Penalties</h2>
        <p>
          It is essential that once you accept a booking, you reach the customer on time without causing any inconvenience. If you fail to attend a booked trip, your account will be inactivated for 5 to 21 days, during which no work will be provided.
        </p>
        <p>
          Customer feedback is collected after every booking. Poor feedback may result in temporary or permanent deactivation of your driver ID. Additionally, if a majority of your accepted bookings are canceled, you may experience delays of up to 15 minutes for subsequent bookings.
        </p>
      </section>

      <div className="agreement-buttons">
        <button className="agree-btn" onClick={handleAgree}>Agree</button>
        <button className="disagree-btn" onClick={handleDisagree}>Disagree</button>
      </div>
    </div>
  );
};

export default DriverJobDetails;
