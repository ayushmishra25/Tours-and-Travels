import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

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
        setErrorMsg("Failed to load driver details. Please try again later."); // Display error
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
          <li><strong>One-way Bookings</strong>: Round trips for 1 to 12 hours or one-way trips of 1 to 80 KM.</li>
        </ul>
        <p>
          The company commission on local and one-way bookings is 15% commission + 5% GST. Overtime is also charged, and a night charge of Rs 300 is applied for driving at night.
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

      <section className="driver-journey">
        <h2>The Sahyog Force Driver Journey: Cultivating Professionalism</h2>
        <p>
          At Sahyog Force, we don't just hire drivers; we cultivate professional chauffeurs. Our comprehensive timeline ensures that every driver is not only skilled but also embodies the values of trust, safety, and exceptional service that define our brand.
        </p>
        <ol>
          <li><strong>Initial Application & Screening (Day 1-3):</strong>
            <ul>
              <li><strong>Process:</strong> Prospective drivers submit their detailed applications online or in person. Our HR team conducts an initial review of qualifications, driving experience, and basic documentation.</li>
              <li><strong>Goal:</strong> To identify candidates who meet our fundamental criteria and possess a foundational driving background.</li>
            </ul>
          </li>
          <li><strong>Rigorous Vetting & Verification (Day 4-10):</strong>
            <ul>
              <li><strong>Process:</strong> This critical phase involves comprehensive background checks, thorough validation of all submitted documents (driving license, Aadhaar, PAN, address proof), and professional reference checks.</li>
              <li><strong>Goal:</strong> To establish absolute trust and ensure the integrity and safety of every potential Sahyog Force driver.</li>
            </ul>
          </li>
          <li><strong>Advanced Driving & Skill Assessment (Day 11-15):</strong>
            <ul>
              <li><strong>Process:</strong> Candidates undergo a practical driving test conducted by certified instructors, evaluating defensive driving techniques, adherence to traffic laws, navigation proficiency in Delhi NCR's complex road network, and vehicle handling across various conditions.</li>
              <li><strong>Goal:</strong> To confirm superior driving skills and adaptability, ensuring safe and efficient journeys for clients.</li>
            </ul>
          </li>
          <li><strong>Comprehensive Professional Training (Day 16-20):</strong>
            <ul>
              <li><strong>Process:</strong> Selected drivers participate in mandatory training modules covering:
                <ul>
                  <li>Client Etiquette & Communication: Mastering respectful interaction, professional greetings, and effective communication.</li>
                  <li>Route Mastery & Efficiency: In-depth knowledge of Delhi NCR routes, traffic patterns, and optimal routing strategies.</li>
                  <li>Safety & Emergency Protocols: First aid basics, vehicle inspection, and handling unforeseen situations calmly.</li>
                  <li>Discretion & Confidentiality: Understanding client privacy and maintaining professional boundaries.</li>
                </ul>
              </li>
              <li><strong>Goal:</strong> To instill the Sahyog Force standards of professionalism, customer service, and safety beyond basic driving.</li>
            </ul>
          </li>
          <li><strong>Onboarding & First Assignment (Day 21-25):</strong>
            <ul>
              <li><strong>Process:</strong> Successful candidates are formally onboarded into the Sahyog Force system. They receive their unique driver ID, platform training, and are then assigned their first client interactions under supervision.</li>
              <li><strong>Goal:</strong> To integrate drivers smoothly into our operational flow and provide them with real-world experience under guidance.</li>
            </ul>
          </li>
          <li><strong>Continuous Professional Development & Feedback (Ongoing):</strong>
            <ul>
              <li><strong>Process:</strong> The journey doesn't end. Drivers receive ongoing training refreshers, performance evaluations based on client feedback, and opportunities for specialized training (e.g., luxury vehicle handling, multi-lingual skills).</li>
              <li><strong>Goal:</strong> To ensure continuous improvement, maintain high service standards, and foster a culture of excellence and growth within the Sahyog Force driver community.</li>
            </ul>
          </li>
        </ol>
      </section>

      <div className="agreement-buttons">
        <button className="agree-btn" onClick={handleAgree}>Agree</button>
        <button className="disagree-btn" onClick={handleDisagree}>Disagree</button>
      </div>
    </div>
  );
};

export default DriverJobDetails;
