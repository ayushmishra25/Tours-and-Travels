import React from "react";
import { FaShieldAlt, FaUserTie, FaMoneyBillWave, FaMobileAlt, FaHeadset, FaSlidersH, FaSmile } from "react-icons/fa";

const WhyChoose = () => {
  return (
    <section className="why-choose">
      
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <FaShieldAlt size={28} color="#0c3c78" />
        Why Choose Sahyog Force?
      </h2>

      <p>
        In a market saturated with options, Sahyog Force stands out as the definitive choice for discerning individuals and businesses in Delhi NCR. Our commitment to excellence is woven into every aspect of our service. We don't just provide a driver; we deliver profound peace of mind.
      </p>
      
      <ul className="why-list">
        <li>
          <FaShieldAlt size={30} color="#002855" />
          <div>
            <strong>Ironclad Trust & Verification</strong>
            <p>
              Every Sahyog Force driver undergoes a rigorous, multi-stage verification process — including deep background checks, police verification, address validation, and document scrutiny. Your safety is our top priority.
            </p>
          </div>
        </li>
        <li>
          <FaUserTie size={30} color="#002855" />
          <div>
            <strong>Unwavering Professionalism</strong>
            <p>
              Our drivers are trained chauffeurs who follow strict codes of conduct. They are courteous, well-groomed, punctual, and possess deep route knowledge across Delhi NCR.
            </p>
          </div>
        </li>
        <li>
          <FaMoneyBillWave size={30} color="#002855" />
          <div>
            <strong>Absolute Transparency in Pricing</strong>
            <p>
              No hidden fees or surge pricing. Our quotes include everything upfront — even driver allowances — ensuring complete financial clarity and predictability.
            </p>
          </div>
        </li>
        <li>
          <FaMobileAlt size={30} color="#002855" />
          <div>
            <strong>Seamless Digital Experience</strong>
            <p>
              Book drivers easily via our mobile app or website. Enjoy real-time tracking, instant confirmations, and smooth payments at your fingertips.
            </p>
          </div>
        </li>
        <li>
          <FaHeadset size={30} color="#002855" />
          <div>
            <strong>24/7 Dedicated Support</strong>
            <p>
              Our support team is available around the clock to help you with bookings, emergencies, or any questions you have — anytime, any day.
            </p>
          </div>
        </li>
        <li>
          <FaSlidersH size={30} color="#002855" />
          <div>
            <strong>Tailored Solutions for Every Need</strong>
            <p>
              Whether it’s hourly, daily, weekly, monthly, or outstation needs — we offer flexible, personalized driver solutions for individuals and businesses alike.
            </p>
          </div>
        </li>
        <li>
          <FaSmile size={30} color="#002855" />
          <div>
            <strong>Driver Welfare & Motivation</strong>
            <p>
              Happy drivers mean better service. We treat our drivers with fairness, respect, and timely compensation — leading to a loyal, motivated workforce.
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default WhyChoose;
