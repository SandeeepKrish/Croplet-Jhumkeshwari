const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String, // hashed
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
});

// Storing in a collection explicitly named 'admin' (defaults to 'admins' if we don't pass third param)
module.exports = mongoose.model('Admin', adminSchema, 'admin');
