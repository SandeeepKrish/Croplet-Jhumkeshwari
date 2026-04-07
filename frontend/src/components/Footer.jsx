import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import "./Footer.css";

// SVG Icons for Socials
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12.03a29 29 0 0 0 .46 5.61 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.61 29 29 0 0 0-.46-5.61z"></path>
    <polygon points="9.75 15.02 15.5 12.01 9.75 9"></polygon>
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Policies */}
        <div className="footer-column">
          <h4>Policy</h4>
          <ul className="footer-links">
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Shipping Policy</Link></li>
            <li><Link to="/">Refund Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
            <li><Link to="/">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Search</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/">FAQs</Link></li>
            <li><Link to="/">Bulk Purchase</Link></li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="footer-column">
          <h4>Newsletter</h4>
          <p className="text-[13px] text-[#999] mb-4 tracking-normal">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button className="newsletter-button">Join</button>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" className="social-icon"><FacebookIcon size={18} /></a>
            <a href="https://instagram.com" className="social-icon"><InstagramIcon size={18} /></a>
            <a href="https://twitter.com" className="social-icon"><TwitterIcon size={18} /></a>
            <a href="https://youtube.com" className="social-icon"><YoutubeIcon size={18} /></a>
          </div>
        </div>

        {/* Column 4: Contact info */}
        <div className="footer-column">
          <h4>Contact Info</h4>
          <ul className="footer-links">
            <li className="flex items-start gap-3 text-[#999] text-[13px] tracking-normal mb-4">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <span>Mahadevpura, Bangalore, Karnataka - 560048</span>
            </li>
            <li className="flex items-center gap-3 text-[#999] text-[13px] tracking-normal mb-4">
              <Phone size={16} className="flex-shrink-0" />
              <span>+91 9682548514</span>
            </li>
            <li className="flex items-center gap-3 text-[#999] text-[13px] tracking-normal mb-4">
              <Mail size={16} className="flex-shrink-0" />
              <span>yourjhumkeshwari@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="brand">JHUMKESHWARI</p>
        <p>© 2026 LOVED WITH YOU. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
