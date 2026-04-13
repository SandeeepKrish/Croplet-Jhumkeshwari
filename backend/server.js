require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first'); // Force IPv4 to prevent ENETUNREACH in Render
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Import Routes
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.set('trust proxy', 1); // Required for rate-limit behind Render proxy

const path = require('path');

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP temporarily to ensure everything loads
})); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss()); // Prevent XSS

// DDoS & Brute Force Protection (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body parser, limiting data content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection (Resilient to whitelist errors)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Clusters successfully!');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('--- ACTION REQUIRED ---');
        console.log('Your IP is likely not whitelisted on MongoDB Atlas.');
        console.log('1. Go to cloud.mongodb.com');
        console.log('2. Network Access -> Add IP Address');
        console.log('3. Add "Allow Access from Anywhere" or your current IP.');
        console.log('------------------------');
    }
};
connectDB();

// Base Route
app.get('/', (req, res) => {
  res.send('Jhumkeshwari API is running...');
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
