import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import ItemModel from "../models/Item.model.js";
import OrderModel from "../models/order.model.js";
import ShopModel from "../models/Shop.model.js";
import UserModel from "../models/User.model.js";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/food-delivery-app";

// ── IDs ───────────────────────────────────────────────────────────
const IDS = {
  // Users
  rahul: new mongoose.Types.ObjectId("aaa000000000000000000001"),
  priya: new mongoose.Types.ObjectId("aaa000000000000000000002"),
  amit: new mongoose.Types.ObjectId("aaa000000000000000000003"),
  neha: new mongoose.Types.ObjectId("aaa000000000000000000004"),
  ravi: new mongoose.Types.ObjectId("aaa000000000000000000005"),
  // Shops
  spice: new mongoose.Types.ObjectId("bbb000000000000000000001"),
  burger: new mongoose.Types.ObjectId("bbb000000000000000000002"),
  // Items
  paneer: new mongoose.Types.ObjectId("ccc000000000000000000001"),
  tikka: new mongoose.Types.ObjectId("ccc000000000000000000002"),
  pizza: new mongoose.Types.ObjectId("ccc000000000000000000003"),
  gulab: new mongoose.Types.ObjectId("ccc000000000000000000004"),
  dosa: new mongoose.Types.ObjectId("ccc000000000000000000005"),
  chickenB: new mongoose.Types.ObjectId("ccc000000000000000000006"),
  vegB: new mongoose.Types.ObjectId("ccc000000000000000000007"),
  fries: new mongoose.Types.ObjectId("ccc000000000000000000008"),
  // Orders
  order1: new mongoose.Types.ObjectId("ddd000000000000000000001"),
  order2: new mongoose.Types.ObjectId("ddd000000000000000000002"),
};

// ── Data ─────────────────────────────────────────────────────────
const hashedPassword = await bcrypt.hash("123456", 10);

const USERS = [
  {
    _id: IDS.rahul,
    fullName: "Rahul Sharma",
    email: "rahul@gmail.com",
    password: hashedPassword,
    mobile: "9876543210",
    role: "user",
    isOnline: false,
    location: { type: "Point", coordinates: [77.3649, 28.6271] },
  },
  {
    _id: IDS.priya,
    fullName: "Priya Singh",
    email: "priya@gmail.com",
    password: hashedPassword,
    mobile: "9812345678",
    role: "user",
    isOnline: false,
    location: { type: "Point", coordinates: [77.3712, 28.6139] },
  },
  {
    _id: IDS.amit,
    fullName: "Amit Verma",
    email: "amit@gmail.com",
    password: hashedPassword,
    mobile: "9988776655",
    role: "owner",
    isOnline: true,
    location: { type: "Point", coordinates: [77.38, 28.62] },
  },
  {
    _id: IDS.neha,
    fullName: "Neha Gupta",
    email: "neha@gmail.com",
    password: hashedPassword,
    mobile: "9871234560",
    role: "owner",
    isOnline: false,
    location: { type: "Point", coordinates: [77.39, 28.63] },
  },
  {
    _id: IDS.ravi,
    fullName: "Ravi Kumar",
    email: "ravi@gmail.com",
    password: hashedPassword,
    mobile: "9001122334",
    role: "deliveryBoy",
    isOnline: true,
    location: { type: "Point", coordinates: [77.365, 28.625] },
  },
];

const SHOPS = [
  {
    _id: IDS.spice,
    name: "Spice Garden",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    owner: IDS.amit,
    city: "Noida",
    state: "Uttar Pradesh",
    address: "Sector 18, Noida - 201301, UP",
    items: [IDS.paneer, IDS.tikka, IDS.pizza, IDS.gulab, IDS.dosa],
  },
  {
    _id: IDS.burger,
    name: "Burger Palace",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828a9b4?w=600",
    owner: IDS.neha,
    city: "Noida",
    state: "Uttar Pradesh",
    address: "Sector 62, Noida - 201309, UP",
    items: [IDS.chickenB, IDS.vegB, IDS.fries],
  },
];

const ITEMS = [
  {
    _id: IDS.paneer,
    name: "paneer butter masala",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
    shop: IDS.spice,
    category: "main-course",
    price: 280,
    foodType: "veg",
    rating: { average: 4.5, count: 120 },
  },
  {
    _id: IDS.tikka,
    name: "chicken tikka",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    shop: IDS.spice,
    category: "snacks",
    price: 220,
    foodType: "non-veg",
    rating: { average: 4.2, count: 89 },
  },
  {
    _id: IDS.pizza,
    name: "margherita pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    shop: IDS.spice,
    category: "pizza",
    price: 349,
    foodType: "veg",
    rating: { average: 4.0, count: 54 },
  },
  {
    _id: IDS.gulab,
    name: "gulab jamun",
    image: "https://images.unsplash.com/photo-1601303516534-bf4d7f2d4a15?w=400",
    shop: IDS.spice,
    category: "desserts",
    price: 80,
    foodType: "veg",
    rating: { average: 4.8, count: 200 },
  },
  {
    _id: IDS.dosa,
    name: "masala dosa",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
    shop: IDS.spice,
    category: "south-indian",
    price: 120,
    foodType: "veg",
    rating: { average: 4.3, count: 76 },
  },
  {
    _id: IDS.chickenB,
    name: "classic chicken burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    shop: IDS.burger,
    category: "burgers",
    price: 199,
    foodType: "non-veg",
    rating: { average: 4.6, count: 310 },
  },
  {
    _id: IDS.vegB,
    name: "veg aloo tikki burger",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400",
    shop: IDS.burger,
    category: "burgers",
    price: 149,
    foodType: "veg",
    rating: { average: 4.1, count: 145 },
  },
  {
    _id: IDS.fries,
    name: "loaded cheese fries",
    image: "https://images.unsplash.com/photo-1604508021597-f6fe54c4cd7a?w=400",
    shop: IDS.burger,
    category: "fast-food",
    price: 129,
    foodType: "veg",
    rating: { average: 4.4, count: 98 },
  },
];

const ORDERS = [
  {
    _id: IDS.order1,
    user: IDS.rahul,
    paymentMethod: "cod",
    deliveryAddress: {
      text: "B-204, Sector 62, Noida - 201309",
      latitude: 28.6271,
      longitude: 77.3649,
    },
    totalAmount: 700,
    payment: false,
    shopOrders: [
      {
        shop: IDS.spice,
        owner: IDS.amit,
        subtotal: 500,
        status: "delivered",
        deliveredAt: new Date("2026-03-10T14:30:00.000Z"),
        shopOrderItems: [
          {
            item: IDS.paneer,
            name: "paneer butter masala",
            price: 280,
            quantity: 1,
          },
          { item: IDS.dosa, name: "masala dosa", price: 120, quantity: 1 },
          { item: IDS.gulab, name: "gulab jamun", price: 80, quantity: 1 },
        ],
      },
      {
        shop: IDS.burger,
        owner: IDS.neha,
        subtotal: 199,
        status: "delivered",
        deliveredAt: new Date("2026-03-10T14:30:00.000Z"),
        shopOrderItems: [
          {
            item: IDS.chickenB,
            name: "classic chicken burger",
            price: 199,
            quantity: 1,
          },
        ],
      },
    ],
  },
  {
    _id: IDS.order2,
    user: IDS.priya,
    paymentMethod: "online",
    deliveryAddress: {
      text: "A-101, Sector 18, Noida - 201301",
      latitude: 28.6139,
      longitude: 77.3712,
    },
    totalAmount: 478,
    payment: true,
    shopOrders: [
      {
        shop: IDS.burger,
        owner: IDS.neha,
        subtotal: 478,
        status: "preparing",
        shopOrderItems: [
          {
            item: IDS.chickenB,
            name: "classic chicken burger",
            price: 199,
            quantity: 1,
          },
          {
            item: IDS.vegB,
            name: "veg aloo tikki burger",
            price: 149,
            quantity: 1,
          },
          {
            item: IDS.fries,
            name: "loaded cheese fries",
            price: 129,
            quantity: 1,
          },
        ],
      },
    ],
  },
];

// ── Seed ─────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      ShopModel.deleteMany({}),
      ItemModel.deleteMany({}),
      OrderModel.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Insert in order (users first, then shops, then items, then orders)
    await UserModel.insertMany(USERS);
    console.log(`👤 Seeded ${USERS.length} users`);

    await ShopModel.insertMany(SHOPS);
    console.log(`🏪 Seeded ${SHOPS.length} shops`);

    await ItemModel.insertMany(ITEMS);
    console.log(`🍔 Seeded ${ITEMS.length} items`);

    await OrderModel.insertMany(ORDERS);
    console.log(`📦 Seeded ${ORDERS.length} orders`);

    console.log("\n🎉 Seeding complete!");
    console.log("──────────────────────────────");
    console.log("Login credentials (all passwords: 123456)");
    console.log("  User:         rahul@gmail.com");
    console.log("  User:         priya@gmail.com");
    console.log("  Owner:        amit@gmail.com");
    console.log("  Owner:        neha@gmail.com");
    console.log("  DeliveryBoy:  ravi@gmail.com");
    console.log("──────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
