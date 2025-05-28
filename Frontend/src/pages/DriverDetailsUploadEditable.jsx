import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverDetailUploadEditable = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    education: "",
    age: "",
    location: "",
    pincode: "",
    zone: "",
    drivingExperienceYears: "",
    drivingExperienceType: "",
    licenseType: "",
    accountNumber: "",
    bankName: "",
    ifsc: "",
    accountHolderName: ""
  });

  const [files, setFiles] = useState({
    photo: null,
    licenseFront: null,
    licenseBack: null,
    aadharFront: null,
    aadharBack: null,
    passbook: null,
  });

  const [initialData, setInitialData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrls, setPreviewUrls] = useState({});

  const token = localStorage.getItem("token");
  const driverId = localStorage.getItem("userId");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch existing driver details
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/driver-details/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setFormData({
          education: data.education || "",
          age: data.age || "",
          location: data.exact_location || "",
          pincode: data.pincode || "",
          zone: data.zone || "",
          drivingExperienceYears: data.driving_experience || "",
          drivingExperienceType: data.car_driving_experience || "",
          licenseType: data.type_of_driving_licence || "",
          accountNumber: data.account_number || "",
          bankName: data.bank_name || "",
          ifsc: data.ifsc_code || "",
          accountHolderName: data.account_holder_name || "",
        });
        setInitialData(data); // for discard
      } catch (error) {
        setErrorMessage("Failed to load driver data.");
        console.error(error);
      }
    };

    if (token) {
      fetchDriverData();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFile } = e.target;
    const file = selectedFile[0];
    setFiles((prev) => ({ ...prev, [name]: file }));

    // Generate preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [name]: previewUrl }));
    }
  };

  const handleDiscard = () => {
    setFormData({
      education: "",
      age: "",
      location: "",
      pincode: "",
      zone: "",
      drivingExperienceYears: "",
      drivingExperienceType: "",
      licenseType: "",
      accountNumber: "",
      bankName: "",
      ifsc: "",
      accountHolderName: ""
    });

    setFiles({
      photo: null,
      licenseFront: null,
      licenseBack: null,
      aadharFront: null,
      aadharBack: null,
      passbook: null
    });

    setPreviewUrls({});
    setSuccessMessage("Form cleared.");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      formDataToSend.append(key, val);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) formDataToSend.append(key, file);
    });

    try {
      await axios.put(`${baseURL}/api/driver-details/edit/${driverId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccessMessage("Driver details updated successfully.");
      setTimeout(() => navigate("/driver-dashboard"), 800);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage("Failed to update driver details.");
    }
  };

  const renderImagePreview = (name, label, existingUrlKey) => (
    <div className="form-group">
      <label>{label}:</label>
      {previewUrls[name] ? (
        <img src={previewUrls[name]} alt={label} style={{ maxWidth: "150px", marginBottom: "10px" }} />
      ) : initialData?.[existingUrlKey] ? (
        <img src={initialData[existingUrlKey]} alt={label} style={{ maxWidth: "150px", marginBottom: "10px" }} />
      ) : null}
      <input type="file" name={name} onChange={handleFileChange} />
    </div>
  );

  return (
    <div className="driver-edit-form-container">
      <h1>Edit Your Details</h1>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="driver-edit-form">
        {renderImagePreview("photo", "Photo", "photo")}

        <div className="form-group">
          <label>Education:</label>
          <input type="text" name="education" value={formData.education} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Exact Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Pincode:</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Zone:</label>
          <input type="text" name="zone" value={formData.zone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Driving Experience (years):</label>
          <input type="number" name="drivingExperienceYears" value={formData.drivingExperienceYears} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Car Driving Experience:</label>
          <select name="drivingExperienceType" value={formData.drivingExperienceType} onChange={handleChange}>
            <option value="">Select type</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="luxury">Luxury</option>
            <option value="All of the above">All of the above</option>
          </select>
        </div>

        {renderImagePreview("licenseFront", "Driving License (Front)", "driving_licence_front")}
        {renderImagePreview("licenseBack", "Driving License (Back)", "driving_licence_back")}

        <div className="form-group">
          <label>Driving License Type:</label>
          <select name="licenseType" value={formData.licenseType} onChange={handleChange}>
            <option value="">Select</option>
            <option value="LMV">LMV</option>
            <option value="MCWG">MCWG</option>
            <option value="MCV">MCV</option>
            <option value="HMV">HMV</option>
          </select>
        </div>

        {renderImagePreview("aadharFront", "Aadhar Front", "aadhar_card_front")}
        {renderImagePreview("aadharBack", "Aadhar Back", "aadhar_card_back")}

        <fieldset>
          <legend>Bank Details</legend>

          <div className="form-group">
            <label>Account Number:</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Bank Name:</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>IFSC Code:</label>
            <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Account Holder Name:</label>
            <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" onClick={handleDiscard} className="discard-btn">Discard</button>
        </div>
      </form>
    </div>
  );
};

export default DriverDetailUploadEditable;
