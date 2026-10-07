const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/orders/
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    const formatted = orders.map((o) => ({
      id: o._id,
      status: o.status,
      shipping_address: o.shipping_address,
      total: o.total,
      created_at: o.createdAt,
      items: o.items.map((i) => ({
        id: i._id,
        product: i.product,
        product_name: i.product_name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
    }));

    res.json({ results: formatted });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// POST /api/orders/ { shipping_address }
router.post('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ detail: 'Cart is empty.' });
    }

    let shippingAddress = req.body.shipping_address || 'Standard Delivery Address';
    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;

      const price = item.product.price;
      total += price * item.quantity;

      orderItems.push({
        product: item.product._id,
        product_name: item.product.name,
        price,
        quantity: item.quantity,
      });

      // Deduct stock
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      status: 'paid',
      shipping_address: shippingAddress,
      total,
      items: orderItems,
    });

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      id: order._id,
      status: order.status,
      shipping_address: order.shipping_address,
      total: order.total,
      created_at: order.createdAt,
      items: order.items.map((i) => ({
        id: i._id,
        product: i.product,
        product_name: i.product_name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
