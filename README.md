# Jhumkeshwari – Online Ethnic Jhumka Marketplace 💎

## 📌 Introduction
Jhumkeshwari is a premium e-commerce platform dedicated to traditional ethnic jhumkas. It digitizes local jewelry markets, providing a seamless, secure, and high-end shopping experience. Featuring AI-driven assistance, professional order management, and hardened backend security.

## 🧱 System Architecture
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)
**Styling:** Vanilla CSS, Lucide React, Framer Motion
**State Management:** Redux Toolkit

## 🛡️ Security Hardening (Production Ready)
The backend is protected against common web vulnerabilities:
- **DDoS & Brute Force Protection**: Implemented `express-rate-limit` to prevent service exhaustion.
- **XSS Prevention**: Cleaned user inputs with `xss-clean` to stop cross-site scripting.
- **Security Headers**: Integrated `helmet` with custom CSP and CORS policies.
- **NoSQL Injection Protection**: Sanitized database queries via `express-mongo-sanitize`.
- **Payload Limits**: Restricted JSON request sizes to 10kb to prevent memory-limit attacks.

## 🚀 Key Features

### 🧞 Jhumka Genie (AI Chatbot)
- Instant support for delivery timelines (5-10 days).
- Guidance on order cancellations and profile management.
- Personalized product recommendations.
- **Access Control**: Chat is gated behind user login to ensure genuine leads.

### 🛍️ Smart Inventory Management
- **Automated New Arrivals**: 5-day sliding window logic. Products automatically move to the "Everyday Demifine" collection after 5 days.
- **Real-time Search**: Instant product discovery with debounced search.

### 📦 Professional Order Management
- **Custom Cancellation Flow**: Replaced generic browser alerts with a premium React modal.
- **Reason Analysis**: Captures user feedback (wrong order, price issues, etc.) and delivers it to the admin dashboard for business analytics.
- **Order Tracking**: Simplified status updates in the user profile.

### 📱 Integrated Support
- **WhatsApp Direct**: One-click connection to business support (+91 9682548514).
- **Contact Sync**: Unified contact information across footer, contact page, and chatbot.

## 🧑‍💻 Architecture Details
- **Frontend**: Component-based architecture with centralized API services.
- **Backend**: Protected RESTful API with JWT authentication for admins and OTP-based verification for users.
- **Database**: Document-oriented MongoDB with automated timestamps for inventory tracking.

## ⚡ Performance
- Optimized image loading via custom URL utility.
- Minimized re-renders using Redux state persistence.
- Localized pincode persistence for accurate delivery estimates.

## 🛠️ Getting Started

### Prerequisites
- Node.js & npm
- MongoDB Atlas account

### Installation
1. Clone the repository
```bash
git clone https://github.com/SandeeepKrish/Croplet-Jhumkeshwari.git
```
2. Install dependencies for both frontend and backend.
3. Configure `.env` in the backend folder.
4. Run development servers:
   - Backend: `npm start`
   - Frontend: `npm run dev`

---
**Conclusion**
Jhumkeshwari bridges the gap between local artisans and the digital world, providing a secure, scalable, and beautifully designed platform for ethnic jewelry.
