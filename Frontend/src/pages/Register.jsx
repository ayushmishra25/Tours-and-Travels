import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    userContact: "",
    userLocation: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const locations = ["Bangalore", "Delhi", "Faridabad", "Ghaziabad", "Noida"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.userName) errors.userName = "Name is required";
    if (!formData.userEmail) errors.userEmail = "Email is required";
    if (!formData.userContact) errors.userContact = "Contact is required";
    if (!formData.userLocation) errors.userLocation = "Location is required";
    if (!formData.userType) errors.userType = "User type is required";
    if (!formData.userPassword) errors.userPassword = "Password is required";
    if (formData.userPassword !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
  
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8000/api/register", {
          name: formData.userName,
          email: formData.userEmail,
          contact: formData.userContact,
          location: formData.userLocation,
          role: formData.userType === "Driver" ? 1 : 0,  // Convert to number
          password: formData.userPassword,
          confirm_password: formData.confirmPassword,   // Send confirm_password too
        });
  
        setSuccessMessage("Registration successful!");
        console.log("Response:", response.data);
      } catch (error) {
        console.error("API Error:", error);
        setApiError(error.response?.data?.message || "Registration failed");
      }
    }
  };
  
  return (
    <div className="register-container">
      <h2>Register Now</h2>
      {apiError && <p className="error">{apiError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        {errors.userName && <p className="error">{errors.userName}</p>}

        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        {errors.userEmail && <p className="error">{errors.userEmail}</p>}

        <input
          type="text"
          name="userContact"
          placeholder="Contact"
          onChange={handleChange}
          required
        />
        {errors.userContact && <p className="error">{errors.userContact}</p>}

        <select name="userLocation" onChange={handleChange} required defaultValue="">
          <option value="" disabled>
            Select Location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        {errors.userLocation && <p className="error">{errors.userLocation}</p>}

        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {errors.userPassword && <p className="error">{errors.userPassword}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <div className="user-type">
          <label>
            <input
              type="radio"
              name="userType"
              value="Driver"
              onChange={handleChange}
            />
            Driver
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="User"
              onChange={handleChange}
            />
            User
          </label>
        </div>
        {errors.userType && <p className="error">{errors.userType}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
