const express = require('express');
const nodemailer = require("nodemailer");
const User = require('../models/User');
const router = express.Router();

// Mock store for OTPs
const otpStore = {};

// 1. Send OTP Email Route
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 600000 }; 

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('❌ EMAIL ERROR: Missing EMAIL_USER or EMAIL_PASS in environment variables.');
        return res.status(500).json({ message: 'Email configuration missing in backend.' });
    }

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // Use 465 to avoid network timeouts on hosting platforms
            secure: true, // true for 465
            requireTLS: true,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: `"Jhumkeshwari" <${EMAIL_USER}>`,
            to: email,
            subject: "Your OTP - Jhumkeshwari 🔐",
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px; color: #232323;">
                    <h2 style="letter-spacing: 0.1em; color: #000;">JHUMKESHWARI</h2>
                    <p style="font-size: 16px;">Hello! Use the OTP below to complete your login securely.</p>
                    <div style="background: #f9f9f9; border: 1px solid #ddd; padding: 20px; margin: 20px auto; width: 200px; font-size: 32px; font-weight: bold; letter-spacing: 0.2em;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes. Do not share it with anyone.</p>
                </div>
            `
        });

        console.log(`✅ Email OTP: ${otp} sent to ${email}`);
        return res.json({ message: 'OTP sent to your email!' }); 
    } catch (error) {
        console.error('❌ EMAIL ERROR:', error.message);
        return res.status(500).json({ message: `Failed to send OTP. Error: ${error.message}` });
    }
});

// 2. Verify OTP Route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    try {
        const isDBConnected = require('mongoose').connection.readyState === 1;
        let user = null;

        if (isDBConnected) {
            user = await User.findOne({ email });
            if (!user) {
                user = new User({ email });
                await user.save();
            }
        } else {
            console.log('⚠️ MongoDB NOT Connected: Falling back to Memory Session (Testing Mode)');
            user = { email, name: '', phone: '' }; 
        }

        // Clean up OTP
        delete otpStore[email];

        return res.json({ 
            message: 'Logged in successfully!', 
            user: { 
                id: user._id, 
                email: user.email,
                name: user.name || '',
                phone: user.phone || ''
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Database Error during login' });
    }
});

// 3. Update Profile Route
router.post('/update-profile', async (req, res) => {
    const { email, name, phone } = req.body;
    const isDBConnected = require('mongoose').connection.readyState === 1;
    try {
        if (isDBConnected) {
            const user = await User.findOneAndUpdate(
                { email },
                { name, phone },
                { new: true, upsert: true }
            );
            return res.json({ message: 'Profile updated successfully!', user: { id: user._id, email: user.email, name: user.name, phone: user.phone } });
        } else {
            return res.json({ message: 'Profile updated (Mocking)', user: { email, name, phone } });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

module.exports = router;
