const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products/
router.get('/', async (req, res) => {
  try {
    const { category, search, slug, ordering } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (slug) {
      filter.slug = slug;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (ordering === 'price') sort = { price: 1 };
    if (ordering === '-price') sort = { price: -1 };
    if (ordering === '-created_at') sort = { createdAt: -1 };

    const products = await Product.find(filter).populate('category').sort(sort);

    const formatted = products.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      image: p.image,
      stock: p.stock,
      is_active: p.isActive,
      category: p.category
        ? { id: p.category._id, name: p.category.name, slug: p.category.slug }
        : null,
      created_at: p.createdAt,
    }));

    res.json({ results: formatted });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// GET /api/products/:id/
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ detail: 'Product not found.' });
    }

    res.json({
      id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      is_active: product.isActive,
      category: product.category
        ? { id: product.category._id, name: product.category.name, slug: product.category.slug }
        : null,
      created_at: product.createdAt,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
