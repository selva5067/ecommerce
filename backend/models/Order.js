const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'paid' },
    shipping_address: { type: String, required: true },
    total: { type: Number, required: true, default: 0 },
    items: [orderItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
