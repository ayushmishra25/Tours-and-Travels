import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DriverDetails = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const resp = await axios.get(`${baseURL}/api/driver-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDriver(resp.data);
      } catch (err) {
        console.error(err);
        setError("The Driver Details does not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !driver) return <p>{error || "Driver not found."}</p>;

  const renderImageSection = (label, filePath, filename) => {
    if (!filePath) return null;
    return (
      <div className="document-box">
        <p><strong>{label}</strong></p>
        <img src={filePath} alt={label} className="document-img" />
        <a
          href={filePath}
          download={filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="download-btn">Download</button>
        </a>
      </div>
    );
  };

  return (
    <div className="driver-details-wrapper">
      <div className="driver-header">
        <h2>Driver Details</h2>
        {driver.photo && (
          <div className="photo-box">
            <img src={driver.photo} alt="Driver" className="driver-photo" />
            <a
              href={driver.photo}
              download="driver_photo.png"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="download-btn">Download Photo</button>
            </a>
          </div>
        )}
      </div>

      <div className="details-section">
        <h3>Personal Information</h3>
        <div className="info-grid">
          <p><strong>Education:</strong> {driver.education || "N/A"}</p>
          <p><strong>Age:</strong> {driver.age || "N/A"}</p>
          <p>
            <strong>Location:</strong>{[driver.exact_location, driver.zone, driver.pincode].filter(Boolean).join(", ") || "N/A"}</p><p>
            <strong>Driving Experience:</strong>{" "}
            {driver.driving_experience
              ? `${driver.driving_experience} years`
              : "N/A"}
          </p>
          <p><strong>Car Driving Experience:</strong> {driver.car_driving_experience || "N/A"}</p>
          <p><strong>License Type:</strong> {driver.type_of_driving_licence || "N/A"}</p>
        </div>
      </div>

      <div className="details-section">
        <h3>Uploaded Documents</h3>
        <div className="documents-grid">
          {renderImageSection("License Front", driver.driving_licence_front, "license_front.png")}
          {renderImageSection("License Back", driver.driving_licence_back, "license_back.png")}
          {renderImageSection("Aadhar Front", driver.aadhar_card_front, "aadhar_front.png")}
          {renderImageSection("Aadhar Back", driver.aadhar_card_back, "aadhar_back.png")}
          {renderImageSection("Passbook", driver.passbook_front, "passbook.png")}
        </div>
      </div>

      <div className="details-section">
        <h3>Bank Details</h3>
        <div className="info-grid">
          <p><strong>Account Number:</strong> {driver.account_number || "N/A"}</p>
          <p><strong>Bank Name:</strong> {driver.bank_name || "N/A"}</p>
          <p><strong>IFSC Code:</strong> {driver.ifsc_code || "N/A"}</p>
          <p><strong>Account Holder Name:</strong> {driver.account_holder_name || "N/A"}</p>
        </div>
      </div>

      {Array.isArray(driver.family_contacts) && driver.family_contacts.length > 0 && (
        <div className="details-section">
          <h3>Family Contacts</h3>
          <div className="family-contacts-grid">
            {driver.family_contacts.slice(0, 3).map((fc, idx) => (
              <div key={idx} className="contact-card">
                <p><strong>Name:</strong> {fc.name || "N/A"}</p>
                <p><strong>Relation:</strong> {fc.relation || "N/A"}</p>
                <p><strong>Contact:</strong> {fc.contact || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* === End Family Contacts === */}
    </div>
  );
};

export default DriverDetails;
