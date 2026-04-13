const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

// In-memory OTP store (works for now; consider MongoDB for persistence across restarts)
const otpStore = {};

// ─── Send OTP via Resend HTTP API (works on Render free tier) ─────────────────
async function sendOTPEmail(toEmail, otp) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // use resend default until domain verified

    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set in environment variables.');
    }

    const html = `
        <div style="font-family: sans-serif; text-align: center; padding: 30px; color: #232323; background: #fafafa;">
            <h2 style="letter-spacing: 0.1em; color: #000; margin-bottom: 8px;">JHUMKESHWARI</h2>
            <p style="font-size: 15px; color: #444;">Hello! Use the OTP below to complete your login securely.</p>
            <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 24px; margin: 24px auto; width: 200px; font-size: 36px; font-weight: bold; letter-spacing: 0.3em; color: #111;">
                ${otp}
            </div>
            <p style="color: #888; font-size: 12px;">This OTP will expire in 10 minutes. Do not share it with anyone.</p>
        </div>
    `;

    const response = await axios.post(
        'https://api.resend.com/emails',
        {
            from: `Jhumkeshwari <${FROM_EMAIL}>`,
            to: [toEmail],
            subject: 'Your OTP – Jhumkeshwari 🔐',
            html,
        },
        {
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        }
    );

    return response.data;
}

// ─── 1. Send OTP Route ─────────────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 600000 }; // 10 min expiry

    try {
        await sendOTPEmail(email, otp);
        console.log(`✅ OTP sent to ${email} via Resend`);
        return res.json({ message: 'OTP sent to your email!' });
    } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        console.error('❌ EMAIL ERROR:', errMsg);
        return res.status(500).json({ message: `Failed to send OTP: ${errMsg}` });
    }
});

// ─── 2. Verify OTP Route ───────────────────────────────────────────────────────
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
            console.log('⚠️ MongoDB NOT Connected: Falling back to Memory Session');
            user = { email, name: '', phone: '' };
        }

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

// ─── 3. Update Profile Route ───────────────────────────────────────────────────
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
            return res.json({
                message: 'Profile updated successfully!',
                user: { id: user._id, email: user.email, name: user.name, phone: user.phone }
            });
        } else {
            return res.json({ message: 'Profile updated (Mocking)', user: { email, name, phone } });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

module.exports = router;
