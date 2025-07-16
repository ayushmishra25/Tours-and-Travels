import React from 'react';
import { Helmet } from "react-helmet";

function About() {
  return (
    <div className="wrapper">
      <Helmet>
        <title>About Sahyog Force | Mission, Vision & Driver Verification</title>
      </Helmet>
      <div className="page-content">
        <section className="about">
          <h2>About Sahyog Force</h2>
          <p>
            <strong>Sahyog Force</strong> is your trusted partner in on-demand professional services. Since our inception in 2025, we've served individuals and businesses across Delhi NCR with dedication, transparency, and excellence.
          </p>
          <p>
            We’re not just delivering services — we’re delivering peace of mind.
          </p>

          {/* Mission & Vision Cards */}
          <div className="card-container">
            <div className="card">
              <div className="card-icon">🎯</div>
              <h4>Our Mission</h4>
              <p>
                Our mission transcends the mere act of transporting you from one location to another; that's far too simplistic for our ambition. Our true quest is to fundamentally transform the once-dreaded and chaotic act of urban travel into an unshakable oasis of calm, a haven of unparalleled efficiency, and an impregnable bastion of unwavering trust.
              </p>
              <p>
                We are on a relentless and dedicated mission to deliver consistently unparalleled ground transportation experiences across the dynamic landscape of Delhi NCR. This grand objective is meticulously achieved through:
              </p>
              <ul>
                <li><strong>Punctuality that borders on the prescient:</strong> We strive to be present, poised, and prepared even before you consciously realize you need us, understanding implicitly that your time is not just valuable, but irreplaceable. We measure our success not just in minutes, but in the relief and assurance we bring.</li>
                <li><strong>Safety meticulously woven into our very DNA:</strong> Our commitment to your security isn't just a checkbox; it's an all-encompassing obsession. Our multi-stage verification process, encompassing stringent police verification, exhaustive background checks, and rigorous driving skill assessments, ensures that every Sahyog Force driver is not just qualified, but exemplary.</li>
                <li><strong>Comfort that meticulously cocoons you:</strong> Our state-of-the-art vehicles are far more than mere conveyances; they are meticulously curated mobile serenity zones, making even the longest journeys feel like a private retreat.</li>
                <li><strong>Service delivered with a genuine smile and exceptionally sharp skills:</strong> Our drivers are more than chauffeurs — they are trained, vetted professionals embodying the pinnacle of courtesy, discretion, and local expertise.</li>
              </ul>
              <p>
                In essence, our mission is not just to see your journey completed, but to ensure it is perfected in every minute detail, leaving you consistently refreshed, profoundly reassured, and optimally prepared for whatever lies ahead.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">🚀</div>
              <h4>Our Vision</h4>
              <p>
                We cast our gaze towards a future for Delhi NCR where the mere thought of navigating the city's vastness doesn't elicit a weary sigh, but rather a profound sense of calm satisfaction and anticipation. Our vision is to ascend to and retain the position of the undisputed benchmark for premium, unequivocally reliable, and profoundly trusted ground transportation across the region.
              </p>
              <ul>
                <li>The name <strong>'Sahyog Force'</strong> becomes universally synonymous with seamless mobility, a powerful brand echoed with confidence and peace of mind by every discerning individual and thriving business within and beyond Delhi NCR.</li>
                <li>We commit to continuous innovation and adaptation, using cutting-edge technology not to replace the human touch but to enhance operational efficiency, personalize experiences, and elevate service to an art form.</li>
                <li>Our community of exceptional, respected drivers consistently sets the gold standard for professionalism, safety, and client satisfaction — acting as ambassadors of our values.</li>
                <li>Every Sahyog Force journey actively contributes to a more harmonious, less stressful, and highly efficient urban environment — one reliably executed ride at a time.</li>
              </ul>
              <p>
                Ultimately, our vision is to fundamentally redefine the very essence of urban travel — transforming it into an effortless, enjoyable, and deeply reliable part of daily life. We aim to prove that the journey can be just as rewarding as the destination. We are not just driving cars; we are driving progress.
              </p>
            </div>
          </div>

          {/* Core Services Section */}
          <h3>Our Core Services</h3>
          <div className="card-container">
            <div className="card">
              <div className="card-icon">🧑‍✈️</div>
              <h4>Driver Services</h4>
              <ul>
                <li><em>Hourly:</em> 12 hrs / 80 km. ₹120/hr overtime, ₹200 night charge.</li>
                <li><em>Weekly:</em> Regular daily needs.</li>
                <li><em>Monthly:</em> Long-term contracts.</li>
                <li><em>Outstation:</em> Transparent city-to-city pricing.</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-icon">🏡</div>
              <h4>Upcoming: Home Help</h4>
              <ul>
                <li><em>Maid Services:</em> Daily or full-time help.</li>
                <li><em>Cook Services:</em> Personal chefs for everyday meals or events.</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-icon">🛡️</div>
              <h4>Specialized Assistance</h4>
              <ul>
                <li><em>Security Guards:</em> For homes, events, or businesses.</li>
                <li><em>Electronics AMC:</em> Annual repair & maintenance.</li>
              </ul>
            </div>
          </div>

          {/* Driver Verification */}
          <h3>Ironclad Driver Verification Process</h3>
          <p>Your safety is our top priority. Every Sahyog Force driver undergoes a 6-step selection:</p>
          <ol>
            <li><strong>Documents Review:</strong> IDs, license, vehicle, address proof.</li>
            <li><strong>Background Check:</strong> Verified via police/criminal screening.</li>
            <li><strong>Driving Test:</strong> Practical assessments.</li>
            <li><strong>Psychometric Test:</strong> Behavior, patience, and mindset checks.</li>
            <li><strong>Training:</strong> Etiquette, navigation, emergency handling.</li>
            <li><strong>Live Monitoring:</strong> GPS tracking and feedback loops.</li>
          </ol>

          {/* Why Choose Us */}
          <h3>Why Choose Sahyog Force?</h3>
          <div className="card-container">
            <div className="card">
              <div className="card-icon">✅</div>
              <h4>Vetted Professionals</h4>
              <p>Only the most skilled and courteous drivers make the cut.</p>
            </div>

            <div className="card">
              <div className="card-icon">💰</div>
              <h4>Transparent Pricing</h4>
              <p>No surprises — everything is clear and upfront.</p>
            </div>

            <div className="card">
              <div className="card-icon">📞</div>
              <h4>24/7 Support</h4>
              <p>Reach a real person anytime you need help.</p>
            </div>

            <div className="card">
              <div className="card-icon">📅</div>
              <h4>Flexible Booking</h4>
              <p>From urgent rides to long-term assignments — we've got you.</p>
            </div>
          </div>

          <p>
            <strong>Sahyog Force</strong> is more than just a service — it’s your dependable companion in everyday life. Whether you're navigating a busy city day or planning something big, we’re here to get you there with peace, pride, and professionalism. 🚗👨‍✈️🏡
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
