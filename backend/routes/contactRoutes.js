const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Public route to send a message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, comment } = req.body;
    const newMessage = new Message({ name, email, phone, comment });
    await newMessage.save();
    res.status(201).json({ message: 'Sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send' });
  }
});

module.exports = router;
