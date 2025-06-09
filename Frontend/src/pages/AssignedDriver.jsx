import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // to get booking_id from URL
import axios from "axios";
import { Helmet } from "react-helmet";

const AssignedDriver = () => {
  const { booking_id } = useParams();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (!booking_id) {
      setLoading(false);
      return;
    }
    const fetchDriver = async () => {
      try {
        const resp = await axios.get(`${baseURL}/api/booking/${booking_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriverData(resp.data);
      } catch (error) {
        console.error("Error fetching Driver Details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [booking_id, baseURL, token]);

  if (loading) return <p>Loading Driver Details...</p>;

  if (!driverData) 
    return (
      <h2 className="no-driver-assigned">
        No Driver is assigned yet, wait for few minutes OR contact the admin.
      </h2>
    );

  // Destructure with optional chaining and defaults
  const {
    driver_name: name = "N/A",
    driver_contact: contact = "N/A",
    driver_location: location = "N/A",
    photo = "",
    age = "N/A",
    location: full_address = "N/A",
    driving_experience: year = "N/A",
    car_driving_experience: driving_experience = "N/A",
    type_of_driving_licence: licence_type = "N/A",
    driving_licence_front: dl_front = "",
    aadhar_card_front: aadhar_front = "",
    aadhar_card_back: aadhar_back = "",
    family_contacts = Array.isArray(driverData.family_contacts) ? driverData.family_contacts : []
    } = driverData;

  return (
    <div className="assigned-driver-container">
      <Helmet>
        <title>Assigned Driver Details</title>
      </Helmet>

      <h2 className="section-title">Assigned Driver Details</h2>

      <div className="driver-profile">
        {photo ? (
          <img src={photo} alt="Driver" className="driver-photo" />
        ) : (
          <div className="no-photo-placeholder">No Photo Available</div>
        )}
        <div className="highlighted-details">
          <h3>{name}</h3>
          <p><strong>Contact:</strong> {contact}</p>
          <p><strong>Location:</strong> {location}</p>
        </div>
      </div>

      <div className="driver-info-grid">
        <div><strong>Age:</strong> {age}</div>
        <div><strong>Full Address:</strong> {full_address}</div>
        <div><strong>Driving Experience:</strong> {year} years</div>
        <div><strong>Car Driving Type:</strong> {driving_experience}</div>
        <div><strong>License Type:</strong> {licence_type}</div>
        <div>
          <strong>DL Front:</strong><br />
          {dl_front ? (
            <img src={dl_front} alt="DL Front" className="doc-img" />
          ) : (
            <p>Not Available</p>
          )}
        </div>
        <div>
          <strong>Aadhar Front:</strong><br />
          {aadhar_front ? (
            <img src={aadhar_front} alt="Aadhar Front" className="doc-img" />
          ) : (
            <p>Not Available</p>
          )}
        </div>
        <div>
          <strong>Aadhar Back:</strong><br />
          {aadhar_back ? (
            <img src={aadhar_back} alt="Aadhar Back" className="doc-img" />
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      {Array.isArray(family_contacts) && family_contacts.length > 0 && (
        <section className="family-contact-section">
        <h3>Family Contacts</h3>
        <div className="family-contact-grid">
          {family_contacts.map((fc, idx) => (
            <div key={idx} className="family-contact-row">
              <p><strong>Name:</strong> {fc.name || "—"}</p>
              <p><strong>Relation:</strong> {fc.relation || "—"}</p>
              <p><strong>Contact:</strong> {fc.contact || "—"}</p>
            </div>
          ))}
        </div>
      </section>
    )}     
    </div>
  );
};

export default AssignedDriver;
