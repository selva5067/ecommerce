const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Helper function to format cart output for frontend compatibility
const formatCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    populate: { path: 'category' },
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  let total = 0;
  const items = cart.items.map((item) => {
    const productPrice = item.product ? item.product.price : 0;
    const subtotal = productPrice * item.quantity;
    total += subtotal;

    return {
      id: item._id,
      quantity: item.quantity,
      subtotal,
      product: item.product
        ? {
            id: item.product._id,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price,
            image: item.product.image,
            stock: item.product.stock,
            category: item.product.category
              ? { id: item.product.category._id, name: item.product.category.name }
              : null,
          }
        : null,
    };
  });

  return { id: cart._id, items, total };
};

// GET /api/cart/
router.get('/', protect, async (req, res) => {
  try {
    const cartData = await formatCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// POST /api/cart/ { product_id, quantity }
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) {
      return res.status(400).json({ detail: 'product_id is required.' });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ detail: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === product_id.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: product_id, quantity: Number(quantity) });
    }

    await cart.save();
    const cartData = await formatCart(req.user._id);
    res.status(201).json(cartData);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// PATCH /api/cart/items/:id/ { quantity }
router.patch('/items/:id/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ detail: 'Cart not found.' });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ detail: 'Cart item not found.' });

    const qty = Number(req.body.quantity);
    if (qty <= 0) {
      cart.items.pull(req.params.id);
    } else {
      item.quantity = qty;
    }

    await cart.save();
    const cartData = await formatCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// DELETE /api/cart/items/:id/
router.delete('/items/:id/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ detail: 'Cart not found.' });

    cart.items.pull(req.params.id);
    await cart.save();

    const cartData = await formatCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
