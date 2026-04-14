const Admin = require('../models/Admin');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Auth failed: User not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Auth failed: Incorrect password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Setup admin — reads credentials from .env (never hardcoded)
// Call this ONCE via: POST /api/admin/setup with the SETUP_SECRET header
exports.setupAdmin = async (req, res) => {
  try {
    // Guard: require a secret header so random people can't reset admin
    const setupSecret = req.headers['x-setup-secret'];
    if (!setupSecret || setupSecret !== process.env.SETUP_SECRET) {
      return res.status(403).json({ error: 'Forbidden: Invalid setup secret' });
    }

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({ error: 'ADMIN_USERNAME or ADMIN_PASSWORD not set in .env' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.findOne({ role: 'admin' });

    if (!admin) {
      const newAdmin = new Admin({ username, password: hashedPassword, role: 'admin' });
      await newAdmin.save();
      return res.json({ message: `Admin account created.` });
    } else {
      admin.username = username;
      admin.password = hashedPassword;
      await admin.save();
      return res.json({ message: `Admin account updated successfully.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup admin' });
  }
};

// Products Management
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    // If file was uploaded via multer, use that path. 
    // Otherwise fallback to body.image if provided as URL.
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : image;

    const newProduct = new Product({
      name,
      price: Number(price),
      description,
      image: imageUrl,
      stock: 10 // default
    });

    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// User Management
exports.getUsers = async (req, res) => {
  try {
    // Fetch users and populate their orders (and the products inside orders)
    const users = await User.find({})
      .populate({
        path: 'orders',
        populate: { path: 'products.productId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Orders Management
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Message Management
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
