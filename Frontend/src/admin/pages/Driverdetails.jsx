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
        // Adjust if driver data is nested inside resp.data.driver
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

  const renderDownload = (label, filePath, filename) => {
    if (!filePath) return null;
    return (
      <div className="field">
        <strong>{label}:</strong>{" "}
        <a
          href={filePath}
          download={filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="driver-details-container">
      <h2>Driver Details - {driver.account_holder_name || "N/A"}</h2>

      {/* Driver Photo */}
      {driver.photo && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={driver.photo}
            alt="Driver"
            className="driver-photo"
          />
          <br />
          <a
            href={driver.photo}
            download="driver_photo.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Download Photo</button>
          </a>
        </div>
      )}

      <div className="field-grid">
        <div className="field">
          <strong>Education:</strong> {driver.education || "N/A"}
        </div>
        <div className="field">
          <strong>Age:</strong> {driver.age || "N/A"}
        </div>
        <div className="field">
          <strong>Location:</strong>{" "}
          {[driver.exact_location, driver.zone, driver.pincode]
            .filter(Boolean)
            .join(", ") || "N/A"}
        </div>
        <div className="field">
          <strong>Driving Experience:</strong>{" "}
          {driver.driving_experience
            ? `${driver.driving_experience} years`
            : "N/A"}
        </div>
        <div className="field">
          <strong>Car Experience:</strong>{" "}
          {driver.car_driving_experience || "N/A"}
        </div>
        <div className="field">
          <strong>License Type:</strong> {driver.type_of_driving_licence || "N/A"}
        </div>

        {/* Document Downloads */}
        {renderDownload("License Front", driver.driving_licence_front, "license_front.png")}
        {renderDownload("License Back", driver.driving_licence_back, "license_back.png")}
        {renderDownload("Aadhar Front", driver.aadhar_card_front, "aadhar_front.png")}
        {renderDownload("Aadhar Back", driver.aadhar_card_back, "aadhar_back.png")}
        {renderDownload("Passbook", driver.passbook_front, "passbook.png")}


        {/* Bank Details */}
        <div className="field">
          <strong>Account Number:</strong> {driver.account_number || "N/A"}
        </div>
        <div className="field">
          <strong>Bank Name:</strong> {driver.bank_name || "N/A"}
        </div>
        <div className="field">
          <strong>IFSC:</strong> {driver.ifsc_code || "N/A"}
        </div>
        <div className="field">
          <strong>Account Holder:</strong> {driver.account_holder_name || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
