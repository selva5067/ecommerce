const mongoose = require('mongoose');
const slugify = require('slugify');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopeasy';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Ensure Default Admin User exists with correct password 'admin123'
    let admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      admin = new User({
        username: 'admin',
        email: 'admin@shopeasy.com',
        password: 'admin123',
        isAdmin: true,
      });
      await admin.save();
      console.log('Created admin user (admin / admin123)');
    } else {
      admin.password = 'admin123';
      await admin.save();
      console.log('Updated admin user password to (admin123)');
    }

    // 2. Data catalog
    const data = {
      'Electronics': [
        [
          'Wireless Noise-Canceling Headphones',
          199.99,
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'Experience high-fidelity audio with active noise-canceling, 30-hour battery life, and ultra-comfortable ear cushions.'
        ],
        [
          'Smart Fitness Watch Series X',
          149.99,
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          'Track workouts, monitor heart rate and sleep, receive notifications, and enjoy a vibrant AMOLED touchscreen display.'
        ],
        [
          'Portable Waterproof Bluetooth Speaker',
          49.99,
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
          '360-degree immersive sound with deep bass. IPX7 waterproof rating perfect for outdoor adventures and pool parties.'
        ],
        [
          'Ergonomic Wireless Mechanical Keyboard',
          119.99,
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          'Customizable RGB backlighting, tactile mechanical switches, multi-device Bluetooth pairing, and long-lasting battery.'
        ],
        [
          'Ultra-Fast USB-C Fast Charger Hub',
          29.99,
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
          '65W GaN fast charger with 4 ports to power your phone, laptop, and accessories simultaneously.'
        ],
      ],
      'Fashion & Apparel': [
        [
          'Premium Organic Cotton T-Shirt',
          24.99,
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
          'Crafted from 100% breathable organic cotton. Classic tailored fit that stays comfortable all day long.'
        ],
        [
          'Vintage Denim Outerwear Jacket',
          79.99,
          'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&auto=format&fit=crop&q=80',
          'Timeless washed denim style featuring heavy-duty brass buttons and spacious front chest pockets.'
        ],
        [
          'Lightweight Performance Running Shoes',
          99.99,
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          'Engineered mesh upper with responsive foam cushioning for superior energy return and maximum road comfort.'
        ],
        [
          'Classic Polarized Sunglasses',
          39.99,
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
          'UV400 protection with lightweight polycarbonate frame. Elegant unisex design suitable for any occasion.'
        ],
      ],
      'Home & Kitchen': [
        [
          'Programmable Espresso & Coffee Machine',
          129.99,
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
          'Brew barista-quality espresso, lattes, and cappuccinos right at home with built-in milk frother and timer.'
        ],
        [
          'Pro-Grade Non-Stick Cookware Set',
          89.99,
          'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&auto=format&fit=crop&q=80',
          'Durable 10-piece cookware set featuring PFOA-free non-stick coating and heat-resistant silicone handles.'
        ],
        [
          'Minimalist LED Desk Lamp with Wireless Charging',
          44.99,
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
          'Touch control with 5 color modes, dimmable brightness levels, auto-off timer, and built-in Qi wireless charging pad.'
        ],
      ],
      'Gadgets & Accessories': [
        [
          'HD Drone with 4K Camera & GPS',
          249.99,
          'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
          'Foldable quadcopter featuring auto-return, follow-me tracking, 25 minutes flight time, and stunning 4K video.'
        ],
        [
          'Leather Minimalist RFID Wallet',
          29.99,
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
          'Genuine top-grain leather with quick pop-up card mechanism and advanced RFID blocking technology.'
        ],
      ]
    };

    let totalCreated = 0;

    for (const [catName, products] of Object.entries(data)) {
      const catSlug = slugify(catName, { lower: true });
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({ name: catName, slug: catSlug });
      }

      for (const [name, price, image, desc] of products) {
        const prodSlug = slugify(name, { lower: true });
        await Product.findOneAndUpdate(
          { slug: prodSlug },
          {
            name,
            slug: prodSlug,
            price,
            image,
            description: desc,
            category: category._id,
            stock: 35,
            isActive: true,
          },
          { upsert: true, new: true }
        );
        totalCreated++;
      }
    }

    console.log(`Successfully seeded ${totalCreated} products across ${Object.keys(data).length} categories into MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
