import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import html2pdf from "html2pdf.js";
import DashboardNavbar from "../components/DashboardNavbar"; // add this at the top


const InvoicePage = () => {
  const invoiceRef = useRef();

  // Static data for rendering invoice
  const invoiceData = {
    customerName: "Rahul Sharma",
    address: "45, Sector 12, Dwarka, New Delhi – 110078",
    email: "rahul.sharma@gmail.com",
    contact: "+91-9876543210",
    serviceType: "Hourly Driver Service",
    startDateTime: "2025-05-01T10:00:00",
    endDateTime: "2025-05-01T14:00:00",
    totalAmount: 100,
    paymentDate: "2025-05-01",
    GSTIN: "07ABCDE1234F2Z5",
    invoiceNumber: "SF-2025-0421",
    invoiceDate: "2025-05-01",
    paymentMethod: "UPI",
    transactionId: "TXN1234567890",
    paymentStatus: "Paid",
    subtotal: 95,
    taxAmount: 5,
  };

  const {
    customerName,
    address,
    email,
    contact,
    serviceType,
    startDateTime,
    endDateTime,
    totalAmount,
    paymentDate,
    GSTIN,
    invoiceNumber,
    invoiceDate,
    paymentMethod,
    transactionId,
    paymentStatus,
    subtotal,
    taxAmount,
  } = invoiceData;

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `${customerName}_Invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
    <DashboardNavbar />
      <Helmet>
        <title>Invoice | Sahyog Force</title>
      </Helmet>

      <div className="invoice-wrapper" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="company-info">
            <h1>Sahyog Force</h1>
            <p className="brand-subtext">By Shankar & Company</p>
            <p>uttam Nagar, New Delhi-110059</p>
            <p>GSTIN: {GSTIN}</p>
            <p>Email: support@sahyogforce.com </p>
            <p>Phone: +91-9220922268</p>
          </div>
          <img
            src="logo.webp" // Path to logo
            alt="Company Logo"
            className="company-logo"
          />
        </div>

        <div className="invoice-metadata">
          <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> {invoiceDate}</p>
          <p><strong>Status:</strong> {paymentStatus}</p>
        </div>

        <h2 className="section-title">Customer Details</h2>
        <div className="invoice-details">
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Contact:</strong> {contact}</p>
        </div>

        <h2 className="section-title">Service Details</h2>
        <div className="invoice-details">
          <p><strong>Service Type:</strong> {serviceType}</p>
          <p><strong>Start:</strong> {new Date(startDateTime).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(endDateTime).toLocaleString()}</p>
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
              <td>₹{taxAmount}</td>
            </tr>
            <tr className="total-row">
              <td><strong>Total</strong></td>
              <td><strong>₹{totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2 className="section-title">Payment Info</h2>
        <div className="invoice-details">
          <p><strong>Payment Date:</strong> {new Date(paymentDate).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          {transactionId && <p><strong>Transaction ID:</strong> {transactionId}</p>}
        </div>

        <div className="footer-note">
          <p>Thank you for choosing Sahyog Force.</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>

      <div className="pdf-button-container">
        <button className="pdf-download-btn" onClick={handleDownloadPDF}>
          Download as PDF
        </button>
      </div>
    </>
  );
};

export default InvoicePage;
