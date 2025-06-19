import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriverNavbar from '../components/DriverNavbar';
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';

const DriverProfile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ rides: 0, earnings: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [driverDetails, setDriverDetails] = useState(null);
  const [driverLoading, setDriverLoading] = useState(true);
  const [driverError, setDriverError] = useState('');
  
  const navigate = useNavigate(); 
  const driverId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (!driverId) {
      setError('Driver not authenticated');
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profile/${driverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setStats(response.data.stats || { rides: 0, earnings: 0 });
        setError(''); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false); 
      }
    };

    const fetchDriverDetails = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/driver-details/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDriverDetails(res.data);
      } catch (err) {
        console.error(err);
        setDriverError("The Driver Details does not exist.");
      } finally {
        setDriverLoading(false);
      }
    };

    fetchProfileData();
    fetchDriverDetails();
  }, [driverId, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderImageSection = (label, filePath, filename) => {
    if (!filePath) return null;
    return (
      <div className="document-box-driver">
        <p><strong>{label}</strong></p>
        <img src={filePath} alt={label} className="document-img-driver" />
        <a
          href={filePath}
          download={filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="download-btn-driver">Download</button>
        </a>
      </div>
    );
  };

  return (
    <>
      <Helmet><title>Driver Profile</title></Helmet>
      <DriverNavbar />

      <div className="profile-container-driver">
        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="profile-card-driver">
            <div className="info-section-driver">
              <h2>{user.name}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <p><strong>Joined:</strong> {formatDate(user.created_at)}</p>
            </div>
          </div>
        )}

        {/* === DriverDetails Section === */}
        {driverLoading ? (
          <p className="loading">Loading driver details...</p>
        ) : driverError ? (
          <p className="error-message">{driverError}</p>
        ) : (
          driverDetails && (
            <div className="driver-details-wrapper-driver">
              <div className="driver-header-driver">
                <h2>Driver Details</h2>
                {driverDetails.photo && (
                  <div className="photo-box-driver">
                    <img src={driverDetails.photo} alt="Driver" className="driver-photo-driver" />
                    <a href={driverDetails.photo} download="driver_photo.png" target="_blank" rel="noopener noreferrer">
                      <button className="download-btn-driver">Download Photo</button>
                    </a>
                  </div>
                )}
              </div>

              <div className="details-section-driver">
                <h3>Personal Information</h3>
                <div className="info-grid-driver">
                  <p><strong>Education:</strong> {driverDetails.education || "N/A"}</p>
                  <p><strong>Age:</strong> {driverDetails.age || "N/A"}</p>
                  <p><strong>Location:</strong>{[driverDetails.exact_location, driverDetails.pincode].filter(Boolean).join(", ") || "N/A"}</p>
                  <p><strong>Driving Experience:</strong> {driverDetails.driving_experience ? `${driverDetails.driving_experience} years` : "N/A"}</p>
                  <p><strong>Car Driving Experience:</strong> {driverDetails.car_driving_experience || "N/A"}</p>
                  <p><strong>License Type:</strong> {driverDetails.type_of_driving_licence || "N/A"}</p>
                </div>
              </div>

              <div className="details-section-driver">
                <h3>Uploaded Documents</h3>
                <div className="documents-grid-driver">
                  {renderImageSection("License Front", driverDetails.driving_licence_front, "license_front.png")}
                  {renderImageSection("License Back", driverDetails.driving_licence_back, "license_back.png")}
                  {renderImageSection("Aadhar Front", driverDetails.aadhar_card_front, "aadhar_front.png")}
                  {renderImageSection("Aadhar Back", driverDetails.aadhar_card_back, "aadhar_back.png")}
                  {renderImageSection("Passbook", driverDetails.passbook_front, "passbook.png")}
                </div>
              </div>

              <div className="details-section-driver">
                <h3>Bank Details</h3>
                <div className="info-grid-driver">
                  <p><strong>Account Number:</strong> {driverDetails.account_number || "N/A"}</p>
                  <p><strong>Bank Name:</strong> {driverDetails.bank_name || "N/A"}</p>
                  <p><strong>IFSC Code:</strong> {driverDetails.ifsc_code || "N/A"}</p>
                  <p><strong>Account Holder Name:</strong> {driverDetails.account_holder_name || "N/A"}</p>
                </div>
              </div>

              {Array.isArray(driverDetails.family_contacts) && driverDetails.family_contacts.length > 0 && (
                <div className="details-section-driver">
                  <h3>Family Contacts</h3>
                  <div className="family-contacts-grid-driver">
                    {driverDetails.family_contacts.slice(0, 3).map((fc, idx) => (
                      <div key={idx} className="contact-card-driver">
                        <p><strong>Name:</strong> {fc.name || "N/A"}</p>
                        <p><strong>Relation:</strong> {fc.relation || "N/A"}</p>
                        <p><strong>Contact:</strong> {fc.contact || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default DriverProfile;
