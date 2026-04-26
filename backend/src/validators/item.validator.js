import Joi from "joi";

export const addItemValidation = Joi.object({
  name: Joi.string().trim().lowercase().required().messages({
    "string.base": "Item name must be a string",
    "string.empty": "Item name is required",
    "any.required": "Item name is required",
  }),

  foodType: Joi.string().valid("veg", "non-veg").required().messages({
    "any.only": "Food type must be either veg or non-veg",
    "any.required": "Food type is required",
    "string.empty": "Food type is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  category: Joi.string()
    .valid(
      "snacks",
      "main-course",
      "desserts",
      "pizza",
      "burgers",
      "sandwiches",
      "south-indian",
      "north-indian",
      "chinese",
      "fast-food",
      "others",
    )
    .required()
    .messages({
      "any.only": "Invalid item category",
      "any.required": "Category is required",
      "string.empty": "Category is required",
    }),

  shopId: Joi.string().hex().length(24).required().messages({
    "string.base": "Shop ID must be a string",
    "string.empty": "Shop ID is required",
    "string.length": "Shop ID must be 24 characters long",
    "string.hex": "Shop ID must be a valid hexadecimal",
    "any.required": "Shop ID is required",
  }),
});

export const editItemValidation = Joi.object({
  name: Joi.string().trim().lowercase().optional().messages({
    "string.base": "Item name must be a string",
    "string.empty": "Item name cannot be empty",
  }),

  foodType: Joi.string().valid("veg", "non-veg").optional().messages({
    "any.only": "Food type must be either veg or non-veg",
    "string.empty": "Food type cannot be empty",
  }),

  price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),

  category: Joi.string()
    .optional()
    .valid(
      "snacks",
      "main-course",
      "desserts",
      "pizza",
      "burgers",
      "sandwiches",
      "south-indian",
      "north-indian",
      "chinese",
      "fast-food",
      "others",
    )
    .messages({
      "any.only": "Invalid item category",
      "string.empty": "Category cannot be empty",
    }),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field is required to update item (name, foodType, price, category)",
  });
