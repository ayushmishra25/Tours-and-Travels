import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DriverDetailUploadEditable = () => {
  const navigate = useNavigate();

  // Form state for text/number inputs
  const [formData, setFormData] = useState({
    education: "",
    age: "",
    location: "",
    pincode: "",
    zone: "",
    drivingExperienceYears: "",
    drivingExperienceType: "",
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
    passbook: null,
  });

  // Family contacts state (3 entries)
  const [familyContacts, setFamilyContacts] = useState([
    { name: "", relation: "", contact: "" },
    { name: "", relation: "", contact: "" },
    { name: "", relation: "", contact: "" },
  ]);

  // Preview URLs for newly selected files
  const [previewUrls, setPreviewUrls] = useState({});

  // For discarding back to blank
  const [initialData, setInitialData] = useState(null);

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token    = localStorage.getItem("token");
  const { driverId } = useParams();
  const baseURL  = import.meta.env.VITE_REACT_APP_BASE_URL;

  // Fetch existing data on mount
  useEffect(() => {
    if (!token) return;
    const fetchDriverData = async () => {
      try {
        const resp = await axios.get(
          `${baseURL}/api/driver-details/${driverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = resp.data;
        // Populate form fields
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
          accountHolderName: data.account_holder_name || ""
        });
        // Populate existing family contacts if available
        if (Array.isArray(data.family_contacts)) {
          setFamilyContacts(data.family_contacts.slice(0,3).map(fc => ({
            name: fc.name || "",
            relation: fc.relation || "",
            contact: fc.contact || ""
          })));
        }
        setInitialData(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Driver Details does not exist.");
      }
    };
    fetchDriverData();
  }, []);

  // Generic form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // File input change + preview
  const handleFileChange = (e) => {
    const { name, files: sel } = e.target;
    const file = sel[0];
    setFiles(prev => ({ ...prev, [name]: file }));
    if (file) {
      setPreviewUrls(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file)
      }));
    }
  };

  // Family contacts change
  const handleFamilyContactChange = (idx, field, value) => {
    const updated = [...familyContacts];
    updated[idx][field] = value;
    setFamilyContacts(updated);
  };

  // Discard → reset to blank
  const handleDiscard = () => {
    setFormData({
      education: "", age: "", location: "", pincode: "",
      zone: "", drivingExperienceYears: "", drivingExperienceType: "",
      licenseType: "", accountNumber: "", bankName: "",
      ifsc: "", accountHolderName: ""
    });
    setFiles({
      photo: null, licenseFront: null, licenseBack: null,
      aadharFront: null, aadharBack: null, passbook: null
    });
    setFamilyContacts([
      { name: "", relation: "", contact: "" },
      { name: "", relation: "", contact: "" },
      { name: "", relation: "", contact: "" }
    ]);
    setPreviewUrls({});
    setSuccessMessage("Form cleared.");
    setErrorMessage("");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const fd = new FormData();
    // Append text fields
    Object.entries(formData).forEach(([k,v]) => fd.append(k, v));
    // Append family contacts
    familyContacts.forEach((fc, i) => {
      fd.append(`family_contacts[${i}][name]`,     fc.name);
      fd.append(`family_contacts[${i}][relation]`, fc.relation);
      fd.append(`family_contacts[${i}][contact]`,  fc.contact);
    });
    // Append files
    Object.entries(files).forEach(([k,f]) => {
      if (f) fd.append(k, f);
    });

    try {
      await axios.put(
        `${baseURL}/api/driver-details/edit/${driverId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setSuccessMessage("Driver details updated successfully.");
      setTimeout(() => navigate("/admin/drivers"), 800);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update driver details.");
    }
  };

  // Helper to render image preview or existing
  const renderImagePreview = (name, label, existingKey) => (
    <div className="form-group">
      <label>{label}:</label>
      {previewUrls[name] 
        ? <img src={previewUrls[name]} alt={label} style={{ maxWidth: 150, marginBottom: 10 }} />
        : initialData?.[existingKey]
          ? <img src={initialData[existingKey]} alt={label} style={{ maxWidth: 150, marginBottom: 10 }} />
          : null
      }
      <input type="file" name={name} onChange={handleFileChange} />
    </div>
  );

  return (
    <div className="driver-edit-form-container">
      <h1>Edit Your Details</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage   && <p className="error-message">{errorMessage}</p>}

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
        {renderImagePreview("licenseBack",  "Driving License (Back)",  "driving_licence_back")}

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
        {renderImagePreview("aadharBack",  "Aadhar Back",  "aadhar_card_back")}

        <fieldset className="account-details">
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

        {/* Family Contact Details */}
        <h3>Family Contact Details</h3>
        <div className="family-contact-section">
          {familyContacts.map((fc, idx) => (
            <div className="family-contact-row" key={idx}>
              <input
                type="text"
                placeholder="Name"
                value={fc.name}
                onChange={(e) => handleFamilyContactChange(idx, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Relation"
                value={fc.relation}
                onChange={(e) => handleFamilyContactChange(idx, "relation", e.target.value)}
              />
              <input
                type="tel"
                placeholder="Contact Number"
                value={fc.contact}
                onChange={(e) => handleFamilyContactChange(idx, "contact", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" onClick={handleDiscard} className="discard-btn-editable">Discard</button>
        </div>
      </form>
    </div>
  );
};

export default DriverDetailUploadEditable;
