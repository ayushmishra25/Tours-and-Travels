import React from 'react';
import { Helmet } from "react-helmet";
function About() {
  return (
    <div className="wrapper">
      <div className="page-content">
        <section className="about">
          <h2>About Sahyog Force</h2>
          <p>
            <strong>Sahyog Force</strong> is your one-stop platform for trusted, on-demand professional services. Since our inception in 2025, we’ve helped many customers simplify their lives by connecting them with rigorously screened, highly skilled service providers.
          </p>

          <h3>Our Core Services</h3>

          <ul>
            <li>
              <strong>Driver Services</strong>  
              <ul>
                <li><em>Hourly</em> — Flexible pick-up or drop-off , up to 12 hours or 80 km. Rs120 per hour will be applied for the overtime and Rs200 for night charges if working after 10PM.</li>
                <li><em>Weekly Bookings</em> — Dedicated driver on a weekly salary for errands, office runs, or events.</li>
                <li><em>Monthly Contracts</em> — Keep a professional driver on board for long-term convenience.</li>
                <li><em>Outstation & On-Demand</em> — Plan intercity travel or last-minute rides with transparent, city-based pricing.</li>
              </ul>
            </li>

            <li>
            <h3>Upcoming Services</h3>
              <strong>Home Help</strong>  
              <ul>
                <li><em>Maid Services</em> — Daily, part-time, or full-time household cleaning.</li>
                <li><em>Cook Services</em> — In-home cooks for daily meals, special occasions, or weekly meal-prep.</li>
              </ul>
            </li>

            <li>
  <strong>Specialized Assistance</strong>  
  <ul>
    <li>
      <em>Security Guard Services</em>  
      — Professionally trained guards for personal, residential, or corporate security, available on hourly, daily, or contract basis.
    </li>
    <li>
      <em>Electronic AMC (Annual Maintenance Contract)</em>  
      — Comprehensive, year-long maintenance plans for your home and office electronics, covering regular servicing, repairs, and priority support.
    </li>
  </ul>
</li>

          </ul>

          <h3>Why Choose Sahyog Force?</h3>
          <ul>
            <li><strong>Stringent Vetting</strong> — Every driver, maid, cook, or guide is background-verified, trained, and insured.</li>
            <li><strong>Transparent Pricing</strong> — No surprise fees—hourly, daily, distance-based and city-specific rates published upfront.</li>
            <li><strong>24/7 Support</strong> — Our customer-care team is always just a call or chat away.</li>
            <li><strong>Easy Booking</strong> — Book via web or mobile in seconds, with real-time tracking and confirmations.</li>
            <li><strong>Flexibility</strong> — Services tailored to your schedule, budget, and special needs.</li>
          </ul>

          <p>
            At <strong>Sahyog Force</strong>, we’re more than just a service provider—we’re your partner in making everyday life smoother, safer, and more convenient. 🚗👩‍🍳🏡
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
