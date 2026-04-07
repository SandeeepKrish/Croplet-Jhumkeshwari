import React from "react";
import "./AboutUs.css";
import jhumkeshwariHero from "../assets/Jhumkeshwari_F.png";

export default function AboutUs() {
  return (
    <div className="about-container">
      {/* Title Hero */}
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          Founded in 2024, Jhumkeshwari is the brainchild of three passionate friends with a 
          shared vision — to bring the beauty of traditional craftsmanship from local 
          artisans into the modern digital landscape.
        </p>
      </section>

      {/* Large Featured Image */}
      <div className="about-image-full">
        <img src={jhumkeshwariHero} alt="Jhumkeshwari Heritage" />
      </div>

      {/* A Brief Moment in Time */}
      <section className="about-section">
        <h2>A BRIEF MOMENT IN TIME</h2>
        <p>
          Jhumkeshwari was born in the vibrant streets of Bangalore. What started as a simple 
          appreciation for ethnic jewelry soon evolved into a mission to bridge the gap 
          between local craftsmanship and a global audience. We believe that every Jhumka 
          tells a story, and behind every story is a skilled artisan who deserves a platform.
        </p>
      </section>

      {/* Sky is the Limit */}
      <section className="about-section">
        <h2>SKY IS THE LIMIT</h2>
        <p>
          Moving beyond the traditional retail model, Jhumkeshwari represents a transition 
          from local markets to a curated digital experience. We've dedicated ourselves to 
          identifying and partnering with the finest local sellers across India, ensuring 
          that each piece we offer is a testament to authenticity and timeless style.
        </p>
      </section>

      {/* Quote Section */}
      <section className="about-quote">
        <blockquote>
          "Jhumkas are and will always be the first thing people notice; your outfit can be couture, but my Jhumkas make it Haute."
        </blockquote>
        <cite>— Team Jhumkeshwari</cite>
      </section>

      {/* Quality Section */}
      <section className="about-section">
        <h2>CURATED CRAFTSMANSHIP</h2>
        <p>
          Quality is the cornerstone of everything we do. We source directly from the heart 
          of India, selecting only the most exquisite designs featuring high-quality metals, 
          semi-precious stones, and traditional detailing. Each piece is hand-curated to 
          ensure it meets the highest standards of elegance and durability.
        </p>
      </section>

      {/* Montage Section */}
      <section className="celebrity-section">
        <h2>JHUMKESHWARI MONTAGE</h2>
        <div className="celebrity-grid">
          <span className="celebrity-item">TRADITIONAL</span>
          <span className="celebrity-item">ETHNIC</span>
          <span className="celebrity-item">MODERN</span>
          <span className="celebrity-item">HANDCRAFTED</span>
          <span className="celebrity-item">TIMELESS</span>
        </div>
      </section>

      {/* footer section */}
      <section className="about-footer-cta">
        <h2>COME SAY NAMASTE</h2>
        <p className="max-w-2xl mx-auto mb-10 text-gray-500 text-sm tracking-widest uppercase">
          Follow us on our journey as we celebrate the magic of Jhumkas.
        </p>
        <div className="cta-links">
          <a href="https://instagram.com" className="cta-button">Instagram</a>
          <a href="/contact-us" className="cta-button">Contact Us</a>
        </div>
      </section>
    </div>
  );
}

