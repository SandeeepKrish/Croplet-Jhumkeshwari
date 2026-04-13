const User = require('../models/User');
const Order = require('../models/Order');
const axios = require('axios');

// ─── Send order notification via Resend HTTP API ───────────────────────────────
async function sendOrderNotification({ name, phone, address, customerEmail, products, totalAmount, orderId }) {
  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  const FROM_EMAIL = (process.env.FROM_EMAIL || 'onboarding@resend.dev').trim();
  const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'yadavsandeep0718@gmail.com').trim();

  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set — skipping order email notification');
    return;
  }

  const productListHTML = products.map(p => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name || 'Product'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${p.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${p.price}</td>
    </tr>
  `).join('');

  await axios.post(
    'https://api.resend.com/emails',
    {
      from: `Jhumkeshwari Orders <${FROM_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: `New Order Received! 🛍️ - From ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
          <h2 style="text-align: center; color: #a87449; letter-spacing: 2px;">NEW ORDER BOOKED</h2>
          <p>Hi Team Jhumkeshwari, you have a new order to deliver!</p>
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; font-size: 14px; color: #666;">CUSTOMER DETAILS</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${address}</p>
          </div>
          <h3 style="font-size: 14px; color: #666;">ORDER ITEMS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #eee;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${productListHTML}</tbody>
          </table>
          <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold;">
            Total Amount: ₹${totalAmount}
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
            Order ID: ${orderId} — Action required: Please review and proceed with delivery.
          </p>
        </div>
      `
    },
    {
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    }
  );
}

exports.placeOrder = async (req, res) => {
  try {
    const { phone, name, address, products, totalAmount, email: customerEmail, userId } = req.body;

    // 1. Find or create user
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user && phone) {
      user = await User.findOne({ phone });
    }
    if (!user) {
      user = new User({ phone, name, address, email: customerEmail });
    } else {
      if (name) user.name = name;
      if (address) user.address = address;
      if (customerEmail) user.email = customerEmail;
      if (phone) user.phone = phone;
    }
    await user.save();

    // 2. Create Order
    const newOrder = new Order({ userId: user._id, products, totalAmount });
    const savedOrder = await newOrder.save();

    // 3. Link Order to User
    user.orders.push(savedOrder._id);
    await user.save();

    // 4. Send Email (non-fatal — order succeeds even if email fails)
    try {
      await sendOrderNotification({ name, phone, address, customerEmail, products, totalAmount, orderId: savedOrder._id });
      console.log(`✅ Order notification sent for order ${savedOrder._id}`);
    } catch (emailErr) {
      console.error('⚠️ Order email failed (order still saved):', emailErr.response?.data?.message || emailErr.message);
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
      user: { id: user._id, phone: user.phone, name: user.name }
    });

  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Also remove from user's orders array
    await User.findByIdAndUpdate(order.userId, { $pull: { orders: order._id } });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
