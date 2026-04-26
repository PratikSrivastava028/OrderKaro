import express from "express";

import {
  googleAuth,
  login,
  logout,
  register,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerValidation), register);

authRouter.post("/login", validateBody(loginValidation), login);

authRouter.post("/send-otp", validateBody(sendOtpValidation), sendOTP);

authRouter.post("/verify-otp", validateBody(verifyOtpValidation), verifyOTP);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordValidation),
  resetPassword,
);

authRouter.post("/logout", authenticate, logout);

authRouter.post("/login-with-sso", googleAuth);

export default authRouter;
