const express = require('express');
const router = express.Router();
const { setupAdmin, adminLogin, getUsers, getOrders, updateOrderStatus } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authMiddleware');

router.post('/setup', setupAdmin);
router.post('/login', adminLogin);

// New: Admin Route to view registered users
router.get('/users', adminProtect, getUsers);
router.get('/orders', adminProtect, getOrders);
router.patch('/orders/:id/status', adminProtect, updateOrderStatus);

// Message routes
const { getMessages, deleteMessage } = require('../controllers/adminController');
router.get('/messages', adminProtect, getMessages);
router.delete('/messages/:id', adminProtect, deleteMessage);

module.exports = router;
