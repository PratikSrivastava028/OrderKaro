import Joi from "joi";

export const placeOrderValidation = Joi.object({
  cartItems: Joi.array()
    .items(
      Joi.object({
        shop: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Invalid shop id",
            "any.required": "Shop id is required",
          }),

        items: Joi.array()
          .items(
            Joi.object({
              item: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                  "string.pattern.base": "Invalid item id",
                }),

              name: Joi.string().trim().required(),

              price: Joi.number().positive().required(),

              quantity: Joi.number().integer().min(1).required(),
            }),
          )
          .min(1)
          .required()
          .messages({
            "array.min": "At least one item is required in shop cart",
          }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Cart cannot be empty",
      "any.required": "Cart items are required",
    }),

  paymentMethod: Joi.string().valid("cod", "online").required().messages({
    "any.only": "Payment method must be cod or online",
  }),

  deliveryAddress: Joi.object({
    text: Joi.string().trim().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  })
    .required()
    .messages({
      "any.required": "Delivery address is required",
    }),

  totalAmount: Joi.number().positive().required().messages({
    "number.base": "Total amount must be a number",
    "any.required": "Total amount is required",
  }),
});
