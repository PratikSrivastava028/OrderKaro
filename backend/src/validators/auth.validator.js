import Joi from "joi";

export const registerValidation = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid mobile number",
      "string.empty": "Mobile number is required",
    }),

  role: Joi.string().valid("user", "owner", "deliveryBoy").required().messages({
    "any.only": "Role must be user, owner, or deliveryBoy",
    "string.empty": "Role is required",
  }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const sendOtpValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
});

export const verifyOtpValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 characters",
    "string.empty": "OTP is required",
  }),
});

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
});
