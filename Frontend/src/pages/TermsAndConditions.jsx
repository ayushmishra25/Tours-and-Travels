import React from "react";
import { Helmet } from "react-helmet";

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p>
        Welcome to <strong>Sahyog Force</strong>. By using our services, you agree to comply with the
        following terms and conditions to ensure a safe and seamless experience.
      </p>

      <section>
        <h2>1. Background Checks</h2>
        <p>
          We conduct thorough background checks on all employees before employment.
          This includes court record verification, work history reviews, document
          verifications, and mandatory physical verification. Only individuals who
          meet our high standards are approved to work. All employees are skilled,
          trained, and reliable, with a minimum of 5 years of experience.
        </p>
      </section>

      <section>
        <h2>2. Workplace & Equipment Maintenance</h2>
        <p>
          For drivers, all company vehicles undergo regular maintenance and safety inspections.
          For cooks and maids, all work equipment and tools must be regularly cleaned and
          maintained to meet safety and hygiene standards.
        </p>
      </section>

      <section>
        <h2>3. Emergency Protocols</h2>
        <p>
          All employees are trained in emergency response procedures, including accident
          handling, medical emergencies, and workplace safety protocols.
        </p>
      </section>

      <section>
        <h2>4. Employee Training</h2>
        <p>
          Employees undergo professional training related to their respective services,
          including customer service and adherence to safety and hygiene standards.
          Periodic refresher courses are mandatory.
        </p>
      </section>

      <section>
        <h2>5. Dress Code & Hygiene</h2>
        <p>
          Employees must wear clean, professional attire while on duty and maintain
          proper personal hygiene. Cooks and maids must follow hygiene and cleanliness
          guidelines as per industry standards.
        </p>
      </section>

      <section>
        <h2>6. No Discrimination or Harassment</h2>
        <p>
          We have a strict zero-tolerance policy against discrimination and harassment.
          Any employee found engaging in such behavior will face immediate disciplinary
          action, up to and including termination.
        </p>
      </section>

      <section>
        <h2>7. Easy Booking Process</h2>
        <p>
          Customers can book a service through our website or phone. Booking confirmation
          details will be sent via SMS or email. Additional features include:
        </p>
        <ul>
          <ul>One-click cancellation and rescheduling</ul>
          <ul>Downloadable invoices</ul>
          <ul>Customer support services</ul>
        </ul>
      </section>

      <section>
        <h2>8. Transparent Pricing</h2>
        <p>
          Service pricing estimates are provided upfront, and customers will never be charged hidden fees.
          Any applicable surcharges (e.g., peak hours) will be clearly communicated before booking confirmation.
        </p>
      </section>

      <section>
        <h2>9. Cancellation Policy</h2>
        <ul>
          <ul>Customers may cancel a service within 30 minutes of booking without a cancellation fee.</ul>
          <ul>Cancellations made within 45 minutes of the scheduled service may be subject to a cancellation charge.</ul>
        </ul>
      </section>

      <section>
        <h2>10. Punctuality & Reliability</h2>
        <p>
          Employees must arrive on time and follow designated work guidelines to ensure
          reliability and professionalism in service delivery.
        </p>
      </section>

      <section>
        <h2>11. Complaint Resolution</h2>
        <p>
          Customers can file complaints via our website or customer service helpline.
          Each complaint will be acknowledged within 24 hours and resolved within the
          same business day.
        </p>
      </section>

      <section>
        <h2>12. Customer Data Protection</h2>
        <p>
          All customer data, including payment details, is securely stored and encrypted.
          We prioritize user privacy and do not share data with third parties without consent.
        </p>
      </section>

      <section>
        <h2>13. Amendments</h2>
        <p>
          Sahyog Force reserves the right to update these terms and conditions as needed.
          Users will be notified of any significant changes.
        </p>
      </section>

      <p className="last-updated">Last updated: March 2025</p>
    </div>
  );
};

export default TermsAndConditions;
