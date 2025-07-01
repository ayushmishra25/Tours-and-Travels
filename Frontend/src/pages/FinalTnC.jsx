import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FinalTnC = () => {
  const navigate = useNavigate();
  const { booking_id } = useParams();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  // On page load: check payment status from /driver-rides
  useEffect(() => {
    if (!booking_id) return;

    // 1. Get payment amount
    axios
      .get(`${BASE_URL}/api/booking/${booking_id}/payment`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setPayableAmount(res.data.payment))
      .catch(err => console.error("Error fetching payment:", err));

    // 2. Get ride info to determine if already paid
    axios
      .get(`${BASE_URL}/api/driver-rides/${booking_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const ride = res.data.ride;
        if (ride.payment_status === true) {
          setIsPaid(true); // hide buttons
        }
      })
      .catch(err => console.error("Error fetching ride info:", err));
  }, [booking_id]);

  // Confirm on server after cash/upi payment
  const confirmOnServer = async (paymentType, paymentReceived = false) => {
    try {
      await axios.put(
        `${BASE_URL}/api/driver-rides/${booking_id}`,
        {
          booking_id,
          payment_type: paymentType,
          payment_status: paymentReceived
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsPaid(true);
      navigate("/dashboard/bookings");
    } catch (error) {
      console.error("Error confirming payment on server:", error);
      alert("Error updating payment status. Please try again.");
    }
  };

  // Razorpay flow
  const openRazorpay = async () => {
    try {
      // Step 1: Indicate intent to pay
      await axios.put(
        `${BASE_URL}/api/driver-rides/${booking_id}`,
        {
          booking_id,
          payment_type: "upi",
          payment_status: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Create order
      const { data: order } = await axios.post(
        `${BASE_URL}/api/create-order`,
        { amount: payableAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 3: Configure Razorpay
      const options = {
        amount: order.amount,
        currency: order.currency,
        name: "Sahyog Force",
        description: `Booking #${booking_id}`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/api/verify-payment`,
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.status === "success") {
              await confirmOnServer("upi", true);
              await axios.post(`${BASE_URL}/api/finalize-payment/${booking_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setIsPaid(true);
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: "",
          contact: ""
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

      {!isPaid && (
        <>
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

          {selectedMethod === "cash" && (
            <div className="payment-info">
              <p className="payment-msg">
                Please pay <strong>₹{payableAmount}</strong> to the driver in cash.
              </p>
              <button
                className="confirm-btn"
                onClick={() => confirmOnServer("cash", false)}
              >
                Yes, Paid
              </button>
            </div>
          )}

          {selectedMethod === "online" && (
            <div className="payment-info">
              <p className="payment-msg">
                You will be charged <strong>₹{payableAmount}</strong> online.
              </p>
              <button className="confirm-btn" onClick={openRazorpay}>
                Pay Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinalTnC;
