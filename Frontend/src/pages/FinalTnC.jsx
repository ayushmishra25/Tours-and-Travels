import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FinalTnC = () => {
  const navigate     = useNavigate();
  const { booking_id } = useParams();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPaid, setIsPaid]               = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const RAZOR_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const token      = localStorage.getItem("token");

  // 1) Fetch how much to pay
  useEffect(() => {
    if (!booking_id) return;
    axios
      .get(`${BASE_URL}/api/booking/${booking_id}/payment`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setPayableAmount(res.data.payment))
      .catch(err => console.error("Error fetching payment:", err));
  }, [booking_id]);

  // 2) Confirm on your backend once payment is done (for both cash and online)
  const confirmOnServer = async (paymentType, paymentReceived = false) => {
    await axios.put(
      `${BASE_URL}/api/driver-rides/${booking_id}`,
      {
        booking_id,
        payment_type: paymentType,
        payment_received: paymentReceived,
        payment_status: true
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsPaid(true);
    navigate("/dashboard/bookings");
  };

  // 3) Create Razorpay order + open Checkout
  const openRazorpay = async () => {
    try {
      // Create order on your backend
      const { data: order } = await axios.post(
        `${BASE_URL}/api/create-order`,
        { amount: payableAmount }, // your backend multiplies by 100
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: RAZOR_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Sahyog Force",
        description: `Booking #${booking_id}`,
        order_id: order.order_id,
        handler: async (response) => {
          // 4) Verify & confirm on your server
          const verifyRes = await axios.post(
            `${BASE_URL}/api/verify-payment`,
            {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            await confirmOnServer("online", true);
            alert("Payment successful!");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: "",    // you can prefill from user profile
          contact: ""   // prefill phone if you have it
        },
        theme: { color: "#28a745" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Unable to initiate payment. Please try again.");
    }
  };

  return (
    <div className="final-tnc-container">
      <h2 className="tnc-heading">Final Terms & Conditions Before Payment</h2>

      <div className="tnc-content">
        <ul>
          <li><strong>GST Charges:</strong> Final charges will include 5% GST.</li>
          <li><strong>Distance-Based Charges:</strong> For distances above 80 km, ₹10/km extra.</li>
          <li><strong>Extended Hours:</strong> ₹120/hr beyond booked hours.</li>
          <li><strong>Night Charges:</strong> ₹200 after 10 PM.</li>
          <li>Ensure the drop-off location is correct.</li>
        </ul>
        <hr />
      </div>

      <div className="proceed-btn-container">
        <button
          className="proceed-btn-cash"
          onClick={() => setSelectedMethod("cash")}
        >
          I Agree & Proceed to Cash Payment
        </button>
        <button
          className="proceed-btn-upi"
          onClick={() => setSelectedMethod("online")}
        >
          I Agree & Proceed to Online Payment
        </button>
      </div>

      {selectedMethod === "cash" && !isPaid && (
        <div className="payment-info">
          <p className="payment-msg">
            Please pay <strong>₹{payableAmount}</strong> to the driver in cash.
          </p>
          <button className="confirm-btn" onClick={() => confirmOnServer("cash", true)}>
            Yes, Paid
          </button>
        </div>
      )}

      {selectedMethod === "online" && !isPaid && (
        <div className="payment-info">
          <p className="payment-msg">
            You will be charged <strong>₹{payableAmount}</strong> online.
          </p>
          <button className="confirm-btn" onClick={openRazorpay}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalTnC;
