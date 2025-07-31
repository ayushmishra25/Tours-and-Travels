import React, { useState } from 'react';

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    city_location: '',
    service_type: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseURL}/api/landing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await res.json();
      alert('Thank you for visiting our page.\nOur team will contact you soon.');
    } catch (error) {
      console.error('Submission error', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '3rem 1rem' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
      }}>
        {/* Content Section */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '3rem', color: '#2c3e50', marginBottom: '1rem' }}>Sahyog Force</h1>
          <p style={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: '1.1rem' }}>Your Trusted Journey Companion</p>
          <p>
            At Sahyog Force, we believe life’s grand narratives aren’t just built on monumental leaps,
            but on the countless smooth transitions in between. Our journey began not in a sterile boardroom,
            but perhaps during a particularly exasperating Delhi traffic jam — a moment of chaotic frustration
            where a simple, yet impactful idea took root:
          </p>
          <p><em>What if travel wasn’t a chore to be endured, but a seamless, stress‑free chapter in your day?</em></p>
          <p>
            Our philosophy is beautifully simple: we handle the logistical complexities, so you can focus
            on what truly matters. We are the silent conductor of your daily commute, the guardian of your
            punctuality, and a provider of pristine, predictable paths.
          </p>
          <p>
            <strong>'Sahyog' (सहयोग):</strong> Collaboration and shared purpose — you’re never alone.<br />
            <strong>'Force':</strong> The discipline and power to ensure consistently excellent service.
          </p>
        </div>

        {/* Form Section */}
        <div style={{
          width: '400px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#2c3e50' }}>Quick Booking Form</h2>
          <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
            Get a verified professional driver in minutes. No hassle. No delay. Just seamless service.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ padding: '0.9rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
              style={{ padding: '0.9rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="city_location"
              placeholder="City / Location"
              value={formData.city_location}
              onChange={handleChange}
              required
              style={{ padding: '0.9rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              required
              style={{ padding: '0.9rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="" disabled>Select Service Type</option>
              <option value="Hourly">Hourly</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="One-Way">One-Way</option>
              <option value="Event">Event</option>
            </select>
            <button
              type="submit"
              style={{
                padding: '1rem',
                backgroundColor: '#2c3e50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Book Now
            </button>
          </form>
        </div>
      </div>

      {/* More Content Below Full Width */}
      <div style={{ maxWidth: '1100px', margin: '3rem auto' }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2>About Sahyog Force</h2>
          <p>
            Sahyog Force is your trusted partner in on-demand professional services.
            Since our inception in 2025, we’ve served individuals and businesses across Delhi NCR with transparency, reliability, and care.
            We don’t just deliver services — we deliver peace of mind.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Our Mission</h2>
          <p>
            Our mission isn’t just to move you — it's to transform urban travel into a calm, efficient, and safe experience.
            Through punctuality, top-tier safety practices, courteous drivers, and well-maintained vehicles,
            we elevate every ride from necessity to delight.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Our Vision</h2>
          <p>
            We envision a future where travel across Delhi NCR evokes not stress, but peace. We aim to be the gold
            standard in professional ground transportation, known for seamless execution, consistent excellence,
            and human-first service — powered by smart tech, but always led by empathy.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Ironclad Driver Verification Process</h2>
          <ul>
            <li>✅ Documents Review: ID, license, address, etc.</li>
            <li>✅ Driving Test & Emergency Handling</li>
            <li>✅ Psychometric Behavior Evaluation</li>
            <li>✅ Etiquette & Navigation Training</li>
            <li>✅ Live GPS Monitoring</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Why Choose Us?</h2>
          <ul>
            <li>✅ Vetted Professionals</li>
            <li>💰 Transparent Pricing</li>
            <li>📞 24/7 Support</li>
            <li>📅 Flexible Booking Options</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Testimonials</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { name: 'Rakesh Kumar', text: 'Sahyog Force transformed my daily commute — always on time, always reliable.' },
              { name: 'Priya Singh', text: 'The driver was courteous, professional, and made me feel safe. Highly recommended!' },
              { name: 'Arjun Mehta', text: 'Sahyog is my go-to for both work and personal travel. Seamless experience every time.' }
            ].map((testimonial, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '1.2rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{ fontStyle: 'italic' }}>"{testimonial.text}"</p>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <p>© 2025 Sahyog Force. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
