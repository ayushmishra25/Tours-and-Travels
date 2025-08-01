import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import html2pdf from "html2pdf.js";

const InvoicePage = () => {
  const { booking_id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (!booking_id) {
      setLoading(false);
      return;
    }
    const fetchInvoice = async () => {
      try {
        const resp = await axios.get(`${baseURL}/api/invoice/${booking_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoiceData(resp.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [booking_id, baseURL, token]);

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `${invoiceData?.name || "Invoice"}_Invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(invoiceRef.current).set(opt).save();
  };

  if (loading) return <p>Loading invoice...</p>;
  if (!invoiceData) return <p>No invoice data found for booking ID: {booking_id}</p>;

  const {
    name,
    address,
    email,
    contact,
    service_type,
    booking_datetime,
    payment_date,
    GSTIN,
    invoiceNumber,
    invoiceDate,
    paymentMethod,
    subtotal,
    GST,
    total_amount,
    night_charge_applied,
  } = invoiceData;

  const bookingDateObj = new Date(booking_datetime);
  let endDateObj = null;

  if (service_type?.toLowerCase() === "monthly") {
    endDateObj = new Date(bookingDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + 11);
  } else if (service_type?.toLowerCase() === "weekly") {
    endDateObj = new Date(bookingDateObj);
    endDateObj.setDate(endDateObj.getDate() + 7);
  }

  return (
    <>
      <Helmet>
        <title>Invoice | Sahyog Force</title>
      </Helmet>

      <div className="invoice-wrapper" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="company-info">
            <h1>Sahyog Force</h1>
            <p className="brand-subtext">By Shankar & Company</p>
            <p>Uttam Nagar, New Delhi-110059</p>
            <p>Email: support@sahyogforce.com</p>
            <p>Phone: +91-9220922268</p>
            <p>GSTIN: 07CGJPG4232R1ZZ</p>
          </div>

          <div className="logo-title">
            <img src="/logo.webp" alt="Sahyog Force Logo" className="navbar-logo" />
          </div>
        </div>

        <div className="invoice-metadata">
          <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> {invoiceDate}</p>
        </div>

        <h2 className="section-title">Customer Details</h2>
        <div className="invoice-details">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Contact:</strong> {contact}</p>
        </div>

        <h2 className="section-title">Service Details</h2>
        <div className="invoice-details">
          <p><strong>Service Type:</strong> {service_type}</p>
          <p><strong>Start Date and Time:</strong> {new Date(booking_datetime).toLocaleString()}</p>
          {endDateObj && (
            <p><strong>End Date:</strong> {endDateObj.toLocaleDateString()}</p>
          )}
        </div>

        <h2 className="section-title">Billing Summary</h2>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td>₹{subtotal}</td>
            </tr>
            <tr>
              <td>GST (5%)</td>
              <td>₹{GST}</td>
            </tr>
            {night_charge_applied && (
              <tr>
                <td>Night Charges</td>
                <td>₹200</td>
              </tr>
            )}
            <tr className="total-row">
              <td><strong>Total</strong></td>
              <td><strong>₹{total_amount}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2 className="section-title">Payment Info</h2>
        <div className="invoice-details">
          <p><strong>Payment Date:</strong> {new Date(payment_date || booking_datetime).toLocaleDateString()}</p>
          {/* <p><strong>Payment Method:</strong> {paymentMethod}</p> */}
          {/* {transactionId && <p><strong>Transaction ID:</strong> {transactionId}</p>} */}
        </div>

        <div className="footer-note">
          <p>Thank you for choosing Sahyog Force.</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
        </div>

        <div className="pdf-button-container">
          <button className="pdf-download-btn" onClick={handleDownloadPDF}>
            Download as PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
