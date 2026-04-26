# 🍔 OrderKaro — Real-Time Food Delivery Web Application

> A full-stack, production-ready food delivery platform built with the **MERN Stack**, featuring live GPS order tracking, integrated payments, Google OAuth, and dedicated dashboards for every stakeholder.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Wolfgang281/OrderKaro--food-del-app/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20LTS-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-black?logo=socket.io)](https://socket.io)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Modules](#-modules)
- [Database Design](#-database-design)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧾 Overview

**OrderKaro** is a multi-role food delivery web application that bridges customers, restaurant owners, delivery partners, and platform administrators on a single unified platform. Unlike aggregator-based systems, OrderKaro is self-hosted — giving restaurant owners full control over their menu, orders, and revenue with zero commission overhead.

The standout feature is **real-time live tracking**: once an order is dispatched, customers can watch their delivery partner move on an interactive Google Map — updated live via WebSocket connections powered by Socket.io.

---

## 🌐 Live Demo

| Role | Link |
|------|------|
| Customer App | [orderkaro.vercel.app](https://orderkaro.vercel.app) |
| API Server | [orderkaro-api.onrender.com](https://orderkaro-api.onrender.com) |

> **Test Credentials**
> - Customer: `customer@demo.com` / `Demo@1234`
> - Owner: `owner@demo.com` / `Demo@1234`
> - Admin: `admin@demo.com` / `Demo@1234`

---

## ✨ Features

### For Customers
- 🔐 Register / Login via Email or **Google OAuth** (Clerk)
- 🔎 Browse and search restaurants by name or cuisine
- 🛒 Add items to cart with live price calculation
- 💳 Checkout and pay via **Razorpay** (UPI, Cards, Net Banking)
- 📍 **Live GPS tracking** of delivery partner on Google Maps
- 📦 Real-time order status updates (Placed → Confirmed → Out for Delivery → Delivered)
- 📜 Full order history with re-order support
- 🔑 OTP-based password reset via email

### For Restaurant Owners
- 🏪 Register and manage restaurant profile with cover image (Cloudinary)
- 🍽️ Full menu management — add, edit, delete items with photos
- 🔔 Real-time new order notifications via Socket.io
- ✅ Confirm orders, assign delivery partners, update order stages
- 📊 Sales dashboard — daily/weekly revenue and order volume

### For Delivery Partners
- 📋 Real-time order queue with assignment notifications
- 🗺️ Google Maps navigation to restaurant and customer
- 📡 Continuous GPS broadcasting to customer's live map
- 💰 Earnings tracker per delivery

### For Administrators
- 👥 Full user management across all roles
- 🏬 Restaurant and delivery partner approval workflows
- 📦 Platform-wide order audit log
- 📈 Analytics overview — users, orders, revenue

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18, Redux Toolkit, React Router v6, Tailwind CSS, Axios |
| **Real-Time** | Socket.io v4 (client + server) |
| **Maps** | Google Maps JavaScript API, `@react-google-maps/api` |
| **Backend** | Node.js v20 LTS, Express.js v4 |
| **Database** | MongoDB Atlas, Mongoose v8 |
| **Auth** | Clerk (`@clerk/react`, `@clerk/express`), JWT (`jsonwebtoken`), bcryptjs |
| **Payments** | Razorpay Orders API (HMAC-SHA256 server-side verification) |
| **Media** | Cloudinary + Multer |
| **Email** | Nodemailer |
| **Build Tool** | Vite |
| **Dev Tools** | Postman, ESLint, Git, VS Code |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│   React SPA · Redux · Google Maps · Socket.io-client   │
└────────────────────────┬────────────────────────────────┘
                         │  REST API (Axios)
                         │  WebSocket (Socket.io)
┌────────────────────────▼────────────────────────────────┐
│                  APPLICATION SERVER                     │
│         Node.js · Express.js · Socket.io Server        │
│     JWT Middleware · Clerk Middleware · Role Guards     │
└──────┬────────────────┬────────────────┬───────────────┘
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│  MongoDB    │  │  Cloudinary │  │  Razorpay  │
│  Atlas      │  │  CDN        │  │  Gateway   │
└─────────────┘  └─────────────┘  └────────────┘
```

### Real-Time Event Flow (Socket.io)

```
Delivery Partner Client
  └─── emits: location-update {lat, lng}
            │
            ▼
        Socket.io Server
            │
            └─── broadcasts: driver-location → Customer's Order Room
                                    │
                                    ▼
                            Customer Client
                              Updates Map Marker in real time
```

---

## 📦 Modules

| Module | Description |
|--------|-------------|
| `Customer` | Browse, order, pay, track deliveries |
| `Restaurant Owner` | Manage menu, handle orders, view analytics |
| `Delivery Partner` | Accept orders, broadcast GPS, mark delivered |
| `Admin` | Platform governance, approvals, audit |

---

## 🗄 Database Design

### Collections

```
users              → _id, name, email, passwordHash, role, clerkId, savedAddresses
shops              → _id, ownerId, name, cuisineType, coordinates, isAcceptingOrders
items              → _id, shopId, name, category, price, imageUrl, isAvailable
orders             → _id, customerId, shopId, items[], orderStatus, paymentStatus
deliveryassignments→ _id, orderId, partnerId, locationHistory[], status
otptokens          → _id, userId, otpHash, expiresAt (TTL index), isUsed
```

### Key Relationships

```
Users (owner)   ──1:N──►  Shops
Shops           ──1:N──►  Items
Users (customer)──1:N──►  Orders
Orders          ──1:1──►  DeliveryAssignments
Users (delivery)──1:N──►  DeliveryAssignments
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- MongoDB Atlas account (or local MongoDB)
- Clerk account
- Razorpay account
- Google Maps API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/Wolfgang281/OrderKaro--food-del-app.git
cd orderkaro
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create `.env` files in both `/server` and `/client` directories.  
See the [Environment Variables](#-environment-variables) section below.

### 4. Run the development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

---

## 🔐 Environment Variables

### `/server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### `/client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

> ⚠️ Never commit `.env` files. They are already listed in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, receive JWT |
| `POST` | `/api/auth/forgot-password` | Public | Send OTP to email |
| `POST` | `/api/auth/reset-password` | Public | Verify OTP, update password |
| `GET` | `/api/shops` | Customer | List all active restaurants |
| `GET` | `/api/shops/:id/items` | Customer | Get menu for a restaurant |
| `POST` | `/api/shops` | Owner | Create / update restaurant |
| `POST` | `/api/items` | Owner | Add menu item |
| `POST` | `/api/orders` | Customer | Place an order |
| `POST` | `/api/orders/verify-payment` | Customer | Verify Razorpay payment |
| `GET` | `/api/orders/my-orders` | Customer | Order history |
| `PATCH` | `/api/orders/:id/status` | Owner / Partner | Update order status |
| `GET` | `/api/admin/users` | Admin | All platform users |

> Full API documentation is available in the Postman collection: [`/docs/OrderKaro.postman_collection.json`](https://github.com/Wolfgang281/OrderKaro--food-del-app/blob/main/docs/OrderKaro.postman_collection.json)

---

## 📸 Screenshots

> *(Add screenshots to `/docs/screenshots/` and update paths below)*

| Customer Home | Live Tracking | Restaurant Dashboard |
|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Tracking](docs/screenshots/tracking.png) | ![Dashboard](docs/screenshots/dashboard.png) |

---

## 🗺 Roadmap

- [x] Customer ordering and cart flow
- [x] Razorpay payment integration
- [x] Socket.io real-time order tracking
- [x] Google Maps live delivery map
- [x] Clerk OAuth + JWT auth
- [x] OTP password reset
- [x] Restaurant owner dashboard
- [x] Delivery partner GPS broadcasting
- [x] Admin panel
- [ ] React Native mobile app
- [ ] AI-powered restaurant recommendations
- [ ] Automated delivery partner dispatch algorithm
- [ ] PWA support (offline menu browsing)
- [ ] Redis Socket.io adapter for horizontal scaling
- [ ] Docker + Kubernetes deployment

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# Fork https://github.com/Wolfgang281/OrderKaro--food-del-app, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and ensure your changes do not break existing functionality.

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/Wolfgang281/OrderKaro--food-del-app/blob/main/LICENSE).

---

<p align="center">
  Built with ❤️ using the MERN Stack &nbsp;|&nbsp; Academic Year 2026–2027
</p>
