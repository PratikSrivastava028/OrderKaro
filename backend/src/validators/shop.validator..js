import Joi from "joi";

export const createShopValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Shop name must be a string",
    "string.empty": "Shop name is required",
    "string.min": "Shop name must be at least 2 characters",
    "string.max": "Shop name cannot exceed 100 characters",
    "any.required": "Shop name is required",
  }),

  city: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "City must be a string",
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters",
    "string.max": "City cannot exceed 50 characters",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "State must be a string",
    "string.empty": "State is required",
    "string.min": "State must be at least 2 characters",
    "string.max": "State cannot exceed 50 characters",
    "any.required": "State is required",
  }),

  address: Joi.string().trim().min(5).max(255).required().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 255 characters",
    "any.required": "Address is required",
  }),
});

export const editShopValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "Shop name must be a string",
    "string.empty": "Shop name is required",
    "string.min": "Shop name must be at least 2 characters",
    "string.max": "Shop name cannot exceed 100 characters",
    "any.required": "Shop name is required",
  }),

  city: Joi.string().trim().min(2).max(50).optional().messages({
    "string.base": "City must be a string",
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters",
    "string.max": "City cannot exceed 50 characters",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().min(2).max(50).optional().messages({
    "string.base": "State must be a string",
    "string.empty": "State is required",
    "string.min": "State must be at least 2 characters",
    "string.max": "State cannot exceed 50 characters",
    "any.required": "State is required",
  }),

  address: Joi.string().trim().min(5).max(255).optional().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 255 characters",
    "any.required": "Address is required",
  }),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field (name, city, state, address) must be provided for update",
  });
