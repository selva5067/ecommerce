# ShopEasy — Full-Stack MERN Stack E-Commerce Web App

A complete, modern e-commerce application built on the **MERN Stack** (**M**ongoDB, **E**xpress.js, **R**eact 18, **N**ode.js).

Features: Product catalog, category pills, live search, sorting, JWT authentication, sliding quick cart drawer, promo code discounts, multi-step checkout, and interactive order history timeline.

---

## 🛠️ Stack Architecture

- **M** — **MongoDB** (Mongoose ODM, custom schemas & relations)
- **E** — **Express.js** (Node.js REST API with JWT Auth middleware)
- **R** — **React 18** (SPA with React Router, Context API, Lucide Icons, Glassmorphism UI)
- **N** — **Node.js** (Runtime environment listening on `http://localhost:8000`)

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Node.js + Express + MongoDB)

```bash
cd backend
npm install
npm run seed     # Seed MongoDB with sample products, categories, & admin user
npm start        # Starts Express server on http://localhost:8000
```

> **Demo Admin User**: `admin` / `admin123`

### 2. Frontend Setup (React 18)

```bash
cd frontend
npm install
npm start        # Starts React app on http://localhost:3000
```

---

## 🔑 Key API Endpoints (`/api/...`)

- `POST /api/auth/register/` `{ username, email, password }`
- `POST /api/auth/login/` `{ username, password }` -> returns `{ access, refresh }`
- `GET  /api/auth/me/` (Auth required)
- `GET  /api/categories/`
- `GET  /api/products/` (supports `?search=`, `?category=`, `?ordering=`)
- `GET  /api/cart/` / `POST /api/cart/` `{ product_id, quantity }`
- `PATCH /api/cart/items/:id/` / `DELETE /api/cart/items/:id/`
- `GET  /api/orders/` / `POST /api/orders/` `{ shipping_address }`

---

## 🎨 Features & Highlights

- **Slide-out Cart Drawer**: Quick view and quantity edit without leaving the page.
- **Toast Notifications**: Interactive popups for all user actions.
- **Free Shipping Progress Bar**: Automatically calculates progress toward free shipping threshold.
- **Promo Discount Codes**: Try entering `PROMO10` (10% off) or `CLIENT20` (20% off).
- **Payment Method Selector**: Credit Card (with mock fields), UPI, or Cash on Delivery.
- **Order Timeline Tracker**: Step-by-step order progress visualization.
