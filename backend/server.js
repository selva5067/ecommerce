const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Product = require('./models/Product');
const seedDatabase = require('./seed_auto');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopeasy';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// API Health Check Route
app.get('/api', (req, res) => {
  res.json({
    name: 'ShopEasy MERN Stack API Server',
    status: 'Running',
    endpoints: ['/api/auth', '/api/categories', '/api/products', '/api/cart', '/api/orders'],
  });
});

// Serve frontend build static files in production / single web service deployment
const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      name: 'ShopEasy MERN Stack API Server',
      status: 'Running',
      endpoints: ['/api/auth', '/api/categories', '/api/products', '/api/cart', '/api/orders'],
    });
  });
}

// Auto-seed database if no products are present
const autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Database empty. Auto-seeding initial product catalog...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Auto-seed check warning:', err.message);
  }
};

// Database Connection & Server Start
const connectWithFallback = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      await mongoose.connect(uri);
      console.log('✅ Connected to MongoDB Atlas / Remote Database');
    } else {
      throw new Error('MONGO_URI environment variable is not set.');
    }
  } catch (err) {
    console.warn('⚠️ MongoDB Primary Connection Warning:', err.message);
    console.log('🔄 Launching embedded In-Memory MongoDB Server fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('✅ Connected to In-Memory MongoDB instance successfully!');
    } catch (memErr) {
      console.error('❌ In-Memory Mongo fallback error:', memErr.message);
    }
  }

  await autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀 MERN Express Server listening on port ${PORT}`);
  });
};

connectWithFallback();

