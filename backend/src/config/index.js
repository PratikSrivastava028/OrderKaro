import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE;
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
export const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
