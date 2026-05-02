import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { FRONTEND_URL } from "./src/config/index.js";

import { errorHandler } from "./src/middlewares/error.middleware.js";

import authRoutes from "./src/routes/auth.route.js";
import itemRoutes from "./src/routes/item.route.js";
import orderRoutes from "./src/routes/order.route.js";
import shopRoutes from "./src/routes/shop.route.js";
import userRoutes from "./src/routes/user.route.js";
import webhookRouter from "./src/routes/webhook.route.js";

const app = express();
const __dirname = path.resolve();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isProd = process.env.NODE_ENV === "production";
      const allowedOrigins = isProd
        ? [process.env.FRONTEND_URL || FRONTEND_URL]
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            FRONTEND_URL,
          ];
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://172.") ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(clerkMiddleware());
app.use("/webhook", webhookRouter);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/item", itemRoutes);
app.use("/api/v1/order", orderRoutes);
    


// Serving Frontend in Production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get(/.*/, (req, res) => {
      res.sendFile(path.resolve(frontendPath, "index.html"));
    });
  }
}

app.use(errorHandler);

export default app;
