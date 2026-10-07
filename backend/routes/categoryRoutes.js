const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories/
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const formatted = categories.map((c) => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
