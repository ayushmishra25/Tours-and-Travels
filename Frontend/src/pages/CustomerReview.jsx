import React, { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Anjali Sharma",
    title: "Corporate Executive",
    location: "Gurugram",
    quote:
      "Sahyog Force has transformed my daily commute. My monthly driver is always punctual, professional, and navigating Delhi’s traffic feels effortless now. Highly recommended!",
  },
  {
    name: "Ritu",
    location: "South Delhi",
    quote:
      "Sahyog Force has truly transformed my daily commute. Punctual, incredibly professional, and the fixed pricing feels like fresh air. Highly recommended for anyone in South Delhi!",
  },
  {
    name: "Rajesh Kumar",
    title: "Business Owner",
    location: "South Delhi",
    quote:
      "Booking an outstation driver for our family trip to Jaipur was a breeze. The driver was excellent, knew the routes perfectly, and made our journey incredibly comfortable. No hidden costs, just pure peace of mind!",
  },
  {
    name: "Vishal Shrivastava",
    quote:
      "Excellent service! The driver was polite, well-dressed, and knew the Delhi routes thoroughly. Charges are reasonable too, making them my go-to driver on call in Delhi.",
  },
  {
    name: "Priya Singh",
    title: "Freelancer",
    location: "Noida",
    quote:
      "For last-minute party drops, Sahyog Force is my go-to. Their hourly drivers are always reliable, and I know I'm in safe hands. It's truly a lifesaver!",
  },
  {
    name: "Siddharth Rao",
    title: "IT Professional",
    location: "Ghaziabad",
    quote:
      "Finding a trustworthy driver for my elderly parents was a concern, but Sahyog Force’s verification process put me at ease. Their weekly driver is a blessing, providing consistent, compassionate service.",
  },
  {
    name: "Vikram Mehta",
    title: "Event Manager",
    location: "Delhi",
    quote:
      "We use Sahyog Force for our corporate events, and their event drivers are simply outstanding. Professional, discreet, and always on time. They add a touch of class to our transport needs.",
  },
];

const CustomerReviews = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section className="testimonials">
      <h2>Hear From Our Valued Clients</h2>
      <div className="testimonial-grid">
        {visibleTestimonials.map((t, idx) => (
          <div key={idx} className="testimonial-card">
            <FaQuoteLeft size={18} color="#002855" />
            <p className="quote">"{t.quote}"</p>
            <p className="author">
              — {t.name}
              {t.title && `, ${t.title}`}
              {t.location && `, ${t.location}`}
            </p>
          </div>
        ))}
      </div>
      <div className="show-more-wrapper">
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "See More"}
        </button>
      </div>
    </section>
  );
};

export default CustomerReviews;
