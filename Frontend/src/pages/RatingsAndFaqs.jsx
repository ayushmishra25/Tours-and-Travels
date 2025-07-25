import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const faqData = [
   {
    q: "How does Sahyog Force ensure driver safety and reliability?",
    a: `We prioritize your peace of mind by implementing a robust, multi-layered verification system for all our drivers. This includes comprehensive background checking, in-depth evaluations of driving proficiency, and ongoing performance monitoring to consistently uphold our high standards. All our drivers are professionally trained in defensive driving and customer etiquette.`,
  },
  {
    q: "What is the difference between your Hourly and Monthly driver services?",
    a: `Hourly Driver: Ideal for short-term needs like errands, airport transfers, or social outings, where you pay only for the hours you use.
Monthly Driver: Provides you with a dedicated driver for an entire month or longer, offering consistent service, familiarity, and relief from HR complexities.`,
  },
  {
    q: "Are your prices all-inclusive, or are there hidden charges?",
    a: `Our pricing is fully transparent and all-inclusive for the services quoted. For outstation trips, driver allowances (food, accommodation) are clearly itemized and communicated upfront, so there are absolutely no hidden charges or surprises.`,
  },
  {
    q: "How do I book a driver with Sahyog Force?",
    a: `You can easily book a driver through directly our website. Simply select your service type, date, time, and location, and we'll confirm your booking instantly.`,
  },
  {
    q: "Can I request the same driver for repeat bookings?",
    a: `Yes, for monthly and weekly services, you will typically have a dedicated driver. For hourly and outstation services, while we cannot guarantee the exact same driver every time due to availability, you can request a preferred driver, and we will do our best to accommodate based on their schedule.`,
  },
  {
    q: "What if my driver cancels at the last minute?",
    a: `Driver cancellations are extremely rare with Sahyog Force due to our robust management. In the unlikely event of an unforeseen issue, we guarantee an immediate replacement driver to ensure your service remains uninterrupted.`,
  },
  {
    q: "Do your drivers handle outstation trips?",
    a: `Absolutely. Our experienced drivers are well-versed in navigating long-distance routes across India. They ensure a safe, comfortable, and efficient journey to your outstation destination in your personal vehicle.`,
  },
  {
    q: "What kind of vehicles do your drivers operate?",
    a: `Our drivers operate your personal vehicle, whether it's a sedan, SUV, luxury car, or any other private car. They are trained to handle a wide range of vehicle types with expertise.`,
  },
  {
    q: "What are your payment options?",
    a: `We offer convenient payment options including secure in-app payments via credit/debit cards, net banking, and popular UPI platforms. Monthly payments can also be set up for recurring services.`,
  },
  {
    q: "Is Sahyog Force available 24/7?",
    a: `Need us? We're available 24 hours a day, 7 days a week, including all public holidays. Our customer support team is also available around the clock to assist you.`,
  },
  {
    q: "Do you offer corporate driver solutions?",
    a: `Yes, we provide tailored corporate driver solutions for businesses, including dedicated drivers for executives, fleet management support, and transport for corporate events. Contact us for customized B2B packages.`,
  },
  {
    q: "What if I need a driver for an event like a wedding or party?",
    a: `Our Event Driver service is specifically designed for such occasions. Our professional drivers ensure punctual arrivals, safe transportation for you and your guests, allowing you to fully enjoy your special event without driving concerns.`,
  },
  {
    q: "How far in advance should I book a driver?",
    a: `For hourly services, you can often book on short notice (e.g., 1-2 hours). For monthly, weekly, outstation, or event services, we recommend booking at least 24-48 hours in advance to ensure optimal driver availability and seamless planning.`,
  },
  {
    q: "What areas in Delhi NCR do you serve?",
    a: `Sahyog Force proudly serves the entire Delhi National Capital Region, including Delhi, Gurugram (Gurgaon), Noida, Ghaziabad, Faridabad, and surrounding areas.`,
  },
];


// sample recent reviews
const recentReviews = [
  { name: "Anjali Sharma", rating: 5, comment: "Excellent service, driver was punctual and courteous!" },
  { name: "Ritu Kapoor", rating: 4, comment: "Very good experience, pricing was transparent." },
  { name: "Rajesh Kumar", rating: 5, comment: "Outstation trip went smoothly, highly recommend." },
];

// rating breakdown percentages
const breakdown = { 5: 70, 4: 15, 3: 8, 2: 5, 1: 2 };

const RatingsAndFaqs = () => {
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const visibleFaqs = showAllFaqs ? faqData : faqData.slice(0, 5);
  const averageRating = 4.8;
  const totalReviews = 128;

  const renderStars = (rating, size = 18) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} size={size} />
        ) : (
          <FaRegStar key={i} size={size} />
        )
      );
    }
    return stars;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Here you would send newReview to your backend...
    console.log("New Review Submitted:", newReview);
    setNewReview({ name: "", rating: 0, comment: "" });
    alert("Thank you for your review!");
  };

  return (
    <section className="ratings-faqs">
      {/* ===== Ratings Section ===== */}
      <div className="ratings-section">
        <h2>Customer Ratings</h2>

        {/* ★★ Average & Stars */}
        <div className="avg-block">
          <div className="avg-stars">{renderStars(Math.round(averageRating), 24)}</div>
          <p className="avg-text">
            {averageRating} out of 5 · {totalReviews} reviews
          </p>
        </div>

        {/* ★★ Rating Breakdown */}
        <div className="rating-breakdown">
          {Object.entries(breakdown).map(([star, pct]) => (
            <div key={star} className="breakdown-row">
              <span className="row-star">{star}★</span>
              <div className="bar">
                <div style={{ width: `${pct}%` }}></div>
              </div>
              <span className="row-pct">{pct}%</span>
            </div>
          ))}
        </div>

        {/* ★★ Recent Reviews */}
        <div className="recent-reviews">
          {recentReviews.map((r, i) => (
            <div key={i} className="review-item">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=002855&color=fff`}
                alt={`${r.name} avatar`}
                className="reviewer-avatar"
              />
              <div className="review-content">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <span className="review-stars">{renderStars(r.rating)}</span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ★★ Write a Review Form */}
        <form className="write-review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a Review</h3>
          <div className="form-group stars-input">
            { [1,2,3,4,5].map((i) => (
              <button
                type="button"
                key={i}
                className={i <= newReview.rating ? "star-btn filled" : "star-btn"}
                onClick={() => setNewReview(r => ({ ...r, rating: i }))}
              >
                <FaStar />
              </button>
            )) }
          </div>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={newReview.name}
            onChange={(e) => setNewReview(r => ({ ...r, name: e.target.value }))}
          />
          <textarea
            placeholder="Your Review"
            rows={3}
            required
            value={newReview.comment}
            onChange={(e) => setNewReview(r => ({ ...r, comment: e.target.value }))}
          />
          <button type="submit" className="submit-review">Submit</button>
        </form>
      </div>

      {/* ===== FAQs Section ===== */}
      <div className="faqs-section">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq-list">
          {visibleFaqs.map((item, idx) => (
            <li key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={(e) => {
                  e.currentTarget.classList.toggle("active");
                  e.currentTarget.nextSibling.classList.toggle("open");
                }}
              >
                {item.q}
                <span className="chevron">
                  <FaChevronDown />
                </span>
              </button>
              <div className="faq-answer">{item.a}</div>
            </li>
          ))}
        </ul>
        <button
          className="show-more-btn"
          onClick={() => setShowAllFaqs(!showAllFaqs)}
        >
          {showAllFaqs ? (
            <>Show Less <FaChevronUp /></>
          ) : (
            <>See More <FaChevronDown /></>
          )}
        </button>
      </div>
    </section>
  );
};

export default RatingsAndFaqs;
  
