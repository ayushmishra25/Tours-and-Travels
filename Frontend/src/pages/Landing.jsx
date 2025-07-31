// (Keep your existing imports)
import React, { useState } from 'react';
import { Link } from 'react-scroll';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaCheckCircle, FaCarSide, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

const testimonials = [
  { name: 'Rakesh Kumar', text: 'Sahyog Force transformed my daily commute — always on time, always reliable.' },
  { name: 'Priya Singh', text: 'The driver was courteous, professional, and made me feel safe. Highly recommended!' },
  { name: 'Arjun Mehta', text: 'Sahyog is my go-to for both work and personal travel. Seamless experience every time.' }
];

const stats = [
  { label: 'Happy Clients', value: 500 },
  { label: 'Professional Drivers', value: 120 },
  { label: 'Daily Rides', value: 50 },
  { label: 'Cities Served', value: 10 }
];

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    city_location: '',
    service_type: '',
    preferred_time: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/api/landing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit form');
      await res.json();
      alert('Thank you for visiting our page.\nOur team will contact you soon.');
      setFormData({
        name: '',
        email: '',
        mobile_number: '',
        city_location: '',
        service_type: '',
        preferred_time: '',
        purpose: '',
      });
    } catch (error) {
      console.error('Submission error', error);
      alert('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };

  const inputStyle = {
    padding: '0.9rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  return (
    <>
      {/* Header */}
      <header style={{
        backgroundColor: 'transparent',
        padding: '1rem',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center'
      }}>
        <img src="/logo.webp" alt="Sahyog Force Logo" style={{ height: '40px', marginRight: '8px' }} />
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#00509d' }}>SAHYOG FORCE</h1>
      </header>

      <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>

        {/* Hero Section */}
        <div style={{
          backgroundImage: 'url(/driver.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100vh',
          padding: '2rem',
          position: 'relative',
          flexWrap: 'wrap'
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1
          }} />

          {/* Hero Text */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '580px',
            color: '#fff',
            padding: '2rem',
            flex: 1
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.3' }}>
              India’s Most Trusted Personal Driver Service
            </h2>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem', maxWidth: '90%' }}>
              Safe, reliable, and available on-demand. Whether it’s daily commute, events, or urgent travel —
              we’ve got you covered.
            </p>
            <Link to="form" smooth duration={500}>
              <button style={{
                marginTop: '1.5rem',
                padding: '0.9rem 1.5rem',
                backgroundColor: '#f39c12',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Book a Driver
              </button>
            </Link>
          </div>

          {/* Form */}
          <div id="form" style={{
            position: 'relative',
            zIndex: 2,
            width: '360px',
            background: 'linear-gradient(145deg, #FFD700, #FFA500)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
            margin: '2rem',
            flexShrink: 0
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.6rem', color: '#2c3e50', fontWeight: '600', textAlign: 'center' }}>
              Book Your Driver Instantly
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
              <input name="mobile_number" placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange} required style={inputStyle} />
              <input name="city_location" placeholder="City / Location" value={formData.city_location} onChange={handleChange} required style={inputStyle} />
              <select name="service_type" value={formData.service_type} onChange={handleChange} required style={inputStyle}>
                <option value="" disabled>Select Service Type</option>
                <option value="Hourly">Hourly</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="One-Way">One-Way</option>
                <option value="Event">Event</option>
              </select>
              <button type="submit" style={{
                padding: '1rem',
                backgroundColor: '#e67e22',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                {loading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <a href="https://wa.me/918800716535" target="_blank" rel="noreferrer" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: '#fff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '28px',
          textDecoration: 'none'
        }}>
          <FaWhatsapp />
        </a>

        {/* Stats */}
        <section style={{ backgroundColor: '#fff', padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#333' }}>We’re growing every day</h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{ minWidth: '120px' }}>
                <h3 style={{ fontSize: '2.2rem', color: '#f39c12' }}>
                  <CountUp end={stat.value} duration={3} />
                  +
                </h3>
                <p style={{ fontWeight: '600', color: '#333' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ backgroundColor: '#fefefe', padding: '3rem 1.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#333' }}>What Makes Us Stand Out?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <FaCarSide size={40} color="#f39c12" />
              <h3>Reliable Drivers</h3>
              <p>Professionally trained & punctual for every ride.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <FaShieldAlt size={40} color="#f39c12" />
              <h3>Background Verified</h3>
              <p>Safety and trust ensured through background checks.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <FaHeadset size={40} color="#f39c12" />
              <h3>24x7 Assistance</h3>
              <p>Get support whenever you need it, wherever you are.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <FaCheckCircle size={40} color="#f39c12" />
              <h3>Transparent Pricing</h3>
              <p>Fair and honest billing — no surprises.</p>
            </div>
          </div>

        </section>

        {/* WhatsApp Button */}
        <a href="https://wa.me/918800716535" target="_blank" rel="noreferrer" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: '#fff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '28px',
          textDecoration: 'none'
        }}>
          <FaWhatsapp />
        </a>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: '#fff',
            padding: '3rem 1.5rem',
          }}
        >
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#c08401' }}>About Sahyog Force</h2>

            <p style={{ marginBottom: '1.2rem' }}>
              At <strong>Sahyog Force</strong>, we believe life’s grand narratives aren’t just built on monumental leaps,
              but on the countless smooth transitions in between. Our journey began not in a sterile boardroom,
              but perhaps during a particularly exasperating Delhi traffic jam – a quintessential urban crucible
              we’ve all, unfortunately, intimately experienced.
            </p>

            <p style={{ marginBottom: '1.2rem' }}>
              What if travel wasn’t a chore to be endured, a gauntlet to be run, but a seamless, stress‑free chapter in your day?
              Our philosophy is simple: we handle the sticky bits so you can focus on what truly matters.
              We are the silent symphony conductor of your daily commute — your invisible guardian of punctuality.
            </p>

            <p style={{ marginBottom: '1.2rem' }}>
              <strong>"Sahyog"</strong> (सहयोग): Collaboration, cooperation, and shared purpose. <br />
              <strong>"Force"</strong>: Precision, professionalism, and positive impact.
            </p>

            <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#b26a00' }}>Our Mission</h3>
            <p style={{ marginBottom: '1.2rem' }}>
              We’re on a mission to make urban travel calm, efficient, and trustworthy. Through punctuality,
              background-verified drivers, and luxurious comfort, we transform the once chaotic act of commuting
              into a sanctuary of reliability.
            </p>

            <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#b26a00' }}>Our Vision</h3>
            <p style={{ marginBottom: '1.2rem' }}>
              Our goal is to become the gold standard for ground transport in Delhi NCR — known for trust,
              consistency, and comfort. Our name should resonate as a promise: your reliable daily companion.
            </p>

            <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#b26a00' }}>Core Services</h3>
            <ul style={{ marginBottom: '1.2rem', paddingLeft: '1.2rem' }}>
              <li>🧑‍✈️ <strong>Driver Services:</strong> Hourly, Weekly, Monthly, One-Way</li>
              <li>🏡 <strong>Home Help:</strong> Maid and Cook Services (upcoming)</li>
              <li>🛡️ <strong>Assistance:</strong> Security Guards, Electronics AMC (upcoming)</li>
            </ul>

            <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#b26a00' }}>Why Choose Us?</h3>
            <ul style={{ paddingLeft: '1.2rem' }}>
              <li>✅ <strong>Vetted Professionals:</strong> Safety-first, background-verified staff.</li>
              <li>💰 <strong>Transparent Pricing:</strong> No hidden fees, honest billing.</li>
              <li>📞 <strong>24/7 Support:</strong> Help is always just a call away.</li>
              <li>📅 <strong>Flexible Booking:</strong> From urgent to long-term needs.</li>
            </ul>

            <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>
              Sahyog Force isn’t just a service — it’s your daily peace of mind.
            </p>
          </div>
        </motion.section>


        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: '#fff',
            padding: '3rem 1.5rem',
          }}
        >
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.7'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              color: '#c08401' // matched heading color
            }}>
              Testimonials
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <p style={{ fontStyle: 'italic' }}>"{t.text}"</p>
                  <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>


      </div>
    </>
  );
};

export default Landing;
