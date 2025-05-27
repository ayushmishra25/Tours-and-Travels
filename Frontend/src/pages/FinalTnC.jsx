import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinalTnC = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    // Navigate to actual payment logic/summary page
    navigate('/invoice/your-booking-id'); // Replace with dynamic route if required
  };

  return (
    <div className="final-tnc-container">
      <h2 className="tnc-heading">Final Terms & Conditions Before Payment</h2>

      <div className="tnc-content">
        <ul>
          <li><strong>GST Charges:</strong> Final charges will include 5% GST.</li>
          <li><strong>Distance-Based Charges:</strong> For distances above 80 km, an additional ₹10/km will be charged. This includes food, accommodation, and convenience.</li>
          <li><strong>Extended Hours:</strong> A service charge of ₹120 per hour will apply for services exceeding the initially booked hours.</li>
          <li><strong>Night Charges:</strong> For services rendered after 10:00 PM, an additional night charge of ₹300 will apply.</li>
          <li>Please ensure the drop-off location is correct before proceeding.</li>
        </ul>
        <hr />
      </div>

      <div className="proceed-btn-container">
        <button className="proceed-btn-cash" onClick={handleProceed}>
          I Agree & Proceed to Cash Payment
        </button>
        <button className="proceed-btn-upi" onClick={handleProceed}>
          I Agree & Proceed to UPI Payment
        </button>
      </div>
    </div>
  );
};

export default FinalTnC;
