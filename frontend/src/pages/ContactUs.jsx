import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle, Send, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuthModal } from "../redux/authSlice";
import "./ContactUs.css";

export default function ContactUs() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { sendMessage } = await import("../services/api");

    toast.promise(
      sendMessage(formData),
      {
        loading: 'Sending your message...',
        success: 'Thank you! We will get back to you soon.',
        error: 'Failed to send. Please try again.',
      }
    ).then(() => {
      setFormData({ name: "", email: "", phone: "", comment: "" });
    });
  };

  return (
    <div className="contact-container">
      {/* Premium WhatsApp Floating Widget */}
      <div 
        className="video-call-widget" 
        onClick={() => {
          if (!isLoggedIn) {
            toast.error("Please login to chat on WhatsApp");
            dispatch(toggleAuthModal());
            return;
          }
          window.open('https://wa.me/919682548514', '_blank');
        }}
      >
        <MessageCircle size={18} />
        <span className="text-[12px] font-bold tracking-widest uppercase">Chat on WhatsApp</span>
        <div className="status-dot"></div>
      </div>

      <header className="contact-header">
        <h1>Contact us</h1>
        <p>
          We'd love to hear from you. Whether you have a question about our Jhumkas,
          orders, or anything else, our team is ready to answer all your questions.
        </p>
      </header>

      <div className="contact-links">
        <a href="mailto:yourjhumkeshwari@gmail.com" className="contact-link-item">
          <div className="contact-link-icon">
            <Mail size={22} />
          </div>
          <span className="contact-link-text">Email</span>
          <span className="contact-link-value">yourjhumkeshwari@gmail.com</span>
        </a>

        <a href="tel:+919682548514" className="contact-link-item">
          <div className="contact-link-icon">
            <Phone size={22} />
          </div>
          <span className="contact-link-text">Call</span>
          <span className="contact-link-value">+91 9682548514</span>
        </a>

        <a 
          href="https://wa.me/919682548514" 
          onClick={(e) => {
            if (!isLoggedIn) {
               e.preventDefault();
               toast.error("Please login to WhatsApp us");
               dispatch(toggleAuthModal());
            }
          }}
          target="_blank" 
          rel="noopener noreferrer" 
          className="contact-link-item"
        >
          <div className="contact-link-icon">
            <MessageCircle size={22} />
          </div>
          <span className="contact-link-text">WhatsApp</span>
          <span className="contact-link-value">+91 9682548514</span>
        </a>
      </div>

      <section className="contact-form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-input"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="form-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="comment">Message</label>
            <textarea
              name="comment"
              id="comment"
              className="form-textarea"
              placeholder="How can we help you?"
              required
              value={formData.comment}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </section>

      {/* Address Section */}
      <div className="mt-20 border-t border-gray-100 pt-16 text-left">
        <h3 className="text-xs uppercase font-bold tracking-[0.3em] text-[#a87449] mb-4">Visit Us</h3>
        <p className="text-sm font-light text-gray-500 leading-relaxed uppercase tracking-widest mb-16">
          Mahadevpura, Bangalore<br />
          Karnataka, India – 560048
        </p>

        {/* Popular Searches */}
        <div className="border-t border-gray-100 pt-10 pb-10">
          <h4 className="text-[12px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 font-bold">Popular Searches</h4>
          <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 text-[15px] text-gray-500 uppercase tracking-widest font-medium">
            <Link to="/" className="hover:text-black transition-colors">Traditional Jhumkas</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Silver Jhumkas</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Oxidized Collection</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Pearl Jhumkas</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Bridal Set</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Daily Wear</Link>
            <span className="text-gray-200">|</span>
            <Link to="/" className="hover:text-black transition-colors">Statement Earrings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

