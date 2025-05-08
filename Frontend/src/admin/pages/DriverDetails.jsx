// src/admin/pages/DriverDetails.jsx
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
        const resp = await axios.get(
          `${baseURL}/api/driver-details/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setDriver(resp.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load driver details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="driver-details-container">
      <h2>Driver Details - {driver.name}</h2>
      {/* Photo top-right */}
      <img
        src={driver.photo_url}
        alt={`Photo of ${driver.name}`}
        className="driver-photo"
      />

      <div className="field-grid">
        <div className="field"><strong>Email:</strong> {driver.email}</div>
        <div className="field"><strong>Contact:</strong> {driver.phone}</div>
        <div className="field"><strong>Education:</strong> {driver.education}</div>
        <div className="field"><strong>Age:</strong> {driver.age}</div>
        <div className="field"><strong>Location:</strong> {driver.exact_location}, {driver.zone}, {driver.pincode}</div>
        <div className="field"><strong>Driving Experience:</strong> {driver.driving_experience} years</div>
        <div className="field"><strong>Car Experience:</strong> {driver.car_driving_experience}</div>
        <div className="field">
          <strong>License Type:</strong> {driver.type_of_driving_licence}
        </div>
        {/* Downloadable docs */}
        <div className="field">
          <strong>License Front:</strong>{' '}
          <a href={driver.driving_licence_front_url} download>Download</a>
        </div>
        <div className="field">
          <strong>License Back:</strong>{' '}
          <a href={driver.driving_licence_back_url} download>Download</a>
        </div>
        <div className="field">
          <strong>Aadhar Front:</strong>{' '}
          <a href={driver.aadhar_card_front_url} download>Download</a>
        </div>
        <div className="field">
          <strong>Aadhar Back:</strong>{' '}
          <a href={driver.aadhar_card_back_url} download>Download</a>
        </div>
        <div className="field">
          <strong>Passbook:</strong>{' '}
          <a href={driver.passbook_front_url} download>Download</a>
        </div>
        <div className="field"><strong>Police Verified:</strong> {driver.police_varified === 'yes' ? 'Yes' : 'No'}</div>
        {driver.police_varified === 'yes' && (
          <div className="field">
            <strong>Police Doc:</strong>{' '}
            <a href={driver.police_varified_docu_url} download>Download</a>
          </div>
        )}
        <div className="field"><strong>Account Number:</strong> {driver.account_number}</div>
        <div className="field"><strong>Bank Name:</strong> {driver.bank_name}</div>
        <div className="field"><strong>IFSC:</strong> {driver.ifsc_code}</div>
        <div className="field"><strong>Account Holder:</strong> {driver.account_holder_name}</div>
      </div>
    </div>
  );
};

export default DriverDetails;