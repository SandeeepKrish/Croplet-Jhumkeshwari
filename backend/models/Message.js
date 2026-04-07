const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'unread', enum: ['unread', 'read', 'archived'] }
});

module.exports = mongoose.model('Message', messageSchema);
