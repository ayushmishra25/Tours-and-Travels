import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
import axios from "axios";
const DriverDetailsUpload = () => {
  const navigate = useNavigate();
  
  // Form state for text/number inputs
  const [formData, setFormData] = useState({
    education: "",
    age: "",
    location: "",
    pincode: "",
    zone: "",
    drivingExperienceYears: "",
    drivingExperienceType: "", // manual, automatic, luxury
    licenseType: "", // options for license type
    accountNumber: "",
    bankName: "",
    ifsc: "",
    accountHolderName: ""
  });
  
  // File state for uploads
  const [files, setFiles] = useState({
    photo: null,
    licenseFront: null,
    licenseBack: null,
    aadharFront: null,
    aadharBack: null,
    passbook: null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [name]: file
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      alert("Please register and login first.");
      return;
    }
  
    // Create a FormData object
    const formDataToSend = new FormData();
  
    // Append all text fields
    formDataToSend.append("education", formData.education);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("exact_location", formData.location);
    formDataToSend.append("pincode", formData.pincode);
    formDataToSend.append("zone", formData.zone);
    formDataToSend.append("driving_experience", formData.drivingExperienceYears);
    formDataToSend.append("car_driving_experience", formData.drivingExperienceType);
    formDataToSend.append("type_of_driving_licence", formData.licenseType);
    formDataToSend.append("account_number", formData.accountNumber);
    formDataToSend.append("bank_name", formData.bankName);
    formDataToSend.append("ifsc_code", formData.ifsc);
    formDataToSend.append("account_holder_name", formData.accountHolderName);
  
    if (files.photo) formDataToSend.append("photo", files.photo);
    if (files.licenseFront) formDataToSend.append("driving_licence_front", files.licenseFront);
    if (files.licenseBack) formDataToSend.append("driving_licence_back", files.licenseBack);
    if (files.aadharFront) formDataToSend.append("aadhar_card_front", files.aadharFront);
    if (files.aadharBack) formDataToSend.append("aadhar_card_back", files.aadharBack);
    if (files.passbook) formDataToSend.append("passbook_front", files.passbook);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/driver-details",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // important
          },
        }
      );
  
      alert("Driver details submitted successfully!");
      console.log("Response from API:", response.data);
      localStorage.setItem("driverUploaded", "true");
      navigate("/driver-dashboard");
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      alert("Failed to submit. Please check the form and try again.");
    }
  };
  
  
  
  
  return (
    <div className="driver-details-container">
      <h1>Upload Your Details</h1>
      <form onSubmit={handleSubmit} className="driver-details-form">
        <div className="form-group">
          <label>Upload Photo:</label>
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
        </div>
        
        <div className="form-group">
          <label>Education:</label>
          <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Enter your education" />
        </div>
        
        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter your age" />
        </div>
        
        <div className="form-group">
          <label>Exact Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your full address" />
        </div>
        
        <div className="form-group">
          <label>Pincode:</label>
          <input type="number" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter pincode" />
        </div>
        
        <div className="form-group">
          <label>Zone:</label>
          <input type="text" name="zone" value={formData.zone} onChange={handleChange} placeholder="Enter your zone/area" />
        </div>
        
        <div className="form-group">
          <label>Driving Experience (in years):</label>
          <input type="number" name="drivingExperienceYears" value={formData.drivingExperienceYears} onChange={handleChange} placeholder="e.g., 3" />
        </div>
        
        <div className="form-group">
          <label>Car Driving Experience:</label>
          <select name="drivingExperienceType" value={formData.drivingExperienceType} onChange={handleChange}>
            <option value="">Select experience type</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Upload Driving License (Both Side):</label>
          <input type="file" name="licenseFront" accept="image/*" onChange={handleFileChange} />
        </div>
        
        
        <div className="form-group">
          <label>Type of Driving License:</label>
          <select name="licenseType" value={formData.licenseType} onChange={handleChange}>
            <option value="">Select License Type</option>
            <option value="LMV">Light Motor Vehicle (LMV)</option>
            <option value="MCWG">Motor Car With Gear (MCWG)</option>
            <option value="MCV">Motor Car Vehicle (MCV)</option>
            <option value="HMV">Heavy Motor Vehicle (HMV)</option>
            {/* Add more options as per your requirements */}
          </select>
        </div>
        
        <div className="form-group">
          <label>Upload Aadhar Card (Both Side):</label>
          <input type="file" name="aadharFront" accept="image/*" onChange={handleFileChange} />
        </div>
        
        <div className="form-group">
          <label>Upload Passbook Front Page:</label>
          <input type="file" name="passbook" accept="image/*" onChange={handleFileChange} />
        </div>
        
        <fieldset className="account-details">
          <legend>Account Details</legend>
          <div className="form-group">
            <label>Account Number:</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter account number" />
          </div>
          <div className="form-group">
            <label>Bank Name:</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Enter bank name" />
          </div>
          <div className="form-group">
            <label>IFSC Code:</label>
            <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} placeholder="Enter IFSC code" />
          </div>
          <div className="form-group">
            <label>Account Holder Name:</label>
            <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Enter account holder name" />
          </div>
        </fieldset>
        
        <div className="form-group">
          <button type="submit" className="submit-btn">Submit Details</button>
        </div>
      </form>
    </div>
  );
};

export default DriverDetailsUpload;
