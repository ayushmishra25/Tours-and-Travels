import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom"; 

const FinalTnC = () => {
  const navigate = useNavigate();
  const { booking_id } = useParams(); // assuming booking_id is in the route param

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [payableAmount, setPayableAmount] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/booking/${booking_id}/payment`);
        setPayableAmount(response.data.payment); // adjust if API response structure differs
      } catch (error) {
        console.error('Error fetching payment:', error);
      }
    };

    if (booking_id) {
      fetchPayment();
    }
  }, [booking_id]);

  const handleProceed = (method) => {
    setSelectedMethod(method);
  };

  const handleConfirmPayment = () => {
    setIsPaid(true);
    navigate('/dashboard/bookings'); // Use booking_id if needed
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
        <button className="proceed-btn-cash" onClick={() => handleProceed('cash')}>
          I Agree & Proceed to Cash Payment
        </button>
        <button className="proceed-btn-upi" onClick={() => handleProceed('upi')}>
          I Agree & Proceed to UPI Payment
        </button>
      </div>

      {selectedMethod === 'cash' && !isPaid && (
        <div className="payment-info">
          <p className="payment-msg">Please pay ₹{payableAmount} to the driver in <strong>cash</strong>.</p>
          <button className="confirm-btn" onClick={handleConfirmPayment}>Yes, Paid</button>
        </div>
      )}

      {selectedMethod === 'upi' && !isPaid && (
        <div className="payment-info">
          <p>Our team is working on it.....currently not available </p>
        </div>
      )}
    </div>
  );
};

export default FinalTnC;
