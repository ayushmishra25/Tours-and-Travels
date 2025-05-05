import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const locations = ["Delhi", "Faridabad", "Ghaziabad", "Noida", "Greater noida"];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userContact") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email) => {
    // Basic email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.userName) errors.userName = "Name is required";
    if (!formData.userEmail) {
      errors.userEmail = "Email is required";
    } else if (!validateEmail(formData.userEmail)) {
      errors.userEmail = "Invalid email format";
    }

    if (!formData.userContact) {
      errors.userContact = "Contact is required";
    } else if (formData.userContact.length !== 10) {
      errors.userContact = "Phone number must be 10 digits";
    }

    if (!formData.userLocation) errors.userLocation = "Location is required";
    if (!formData.userType) errors.userType = "User type is required";
    if (!formData.userPassword) errors.userPassword = "Password is required";
    if (formData.userPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (validateForm()) {
      try {
        const response = await axios.post("http://65.0.163.37:8000/api/register", {
          name: formData.userName,
          email: formData.userEmail,
          phone: formData.userContact,
          location: formData.userLocation,
          role: formData.userType === "Driver" ? 1 : 0,
          password: formData.userPassword,
          confirm_password: formData.confirmPassword,
        });

        const message = response.data.message;
        console.log("Response:", message);

        if (message.toLowerCase().includes("registered")) {
          localStorage.setItem("registered", "true");
          setSuccessMessage("Registration successful!");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          setApiError(message || "Registration failed");
        }

      } catch (error) {
        console.error("API Error:", error);
      
        const resErrors = error.response?.data?.errors;
      
        if (resErrors) {
          // Check for email error
          if (resErrors.email) {
            setApiError(resErrors.email[0]);
          } else if (resErrors.phone) {
            setApiError(resErrors.phone[0]);
          } else {
            // Display first available error message
            const firstKey = Object.keys(resErrors)[0];
            setApiError(resErrors[firstKey][0]);
          }
        } else {
          setApiError(error.response?.data?.message || "Registration failed");
        }
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
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && <p className="error">{errors.userName}</p>}

        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          value={formData.userEmail}
          onChange={handleChange}
        />
        {errors.userEmail && <p className="error">{errors.userEmail}</p>}

        <input
          type="text"
          name="userContact"
          placeholder="Contact"
          value={formData.userContact}
          onChange={handleChange}
          maxLength="10"
        />
        {errors.userContact && <p className="error">{errors.userContact}</p>}

        <select
          name="userLocation"
          value={formData.userLocation}
          onChange={handleChange}
        >
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
          value={formData.userPassword}
          onChange={handleChange}
        />
        {errors.userPassword && <p className="error">{errors.userPassword}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <div className="user-type">
          <label>
            <input
              type="radio"
              name="userType"
              value="Driver"
              checked={formData.userType === "Driver"}
              onChange={handleChange}
            />
            Driver
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="User"
              checked={formData.userType === "User"}
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
