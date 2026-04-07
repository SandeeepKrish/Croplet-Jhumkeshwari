const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/mine/:userId', orderController.getUserOrders);
router.delete('/cancel/:orderId', orderController.deleteOrder);

module.exports = router;
