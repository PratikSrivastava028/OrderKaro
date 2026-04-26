import { Router } from "express";
import {
  createShop,
  editShop,
  getShop,
  getShopByCity,
} from "../controllers/shop.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createShopValidation,
  editShopValidation,
} from "../validators/shop.validator..js";

const shopRouter = Router();

shopRouter.post(
  "/create",
  authenticate,
  upload.single("image"),
  validateBody(createShopValidation),
  createShop,
);

shopRouter.patch(
  "/edit/:shopId",
  authenticate,
  upload.single("image"),
  validateBody(editShopValidation),
  editShop,
);

shopRouter.get("/get-my-shop", authenticate, getShop);

shopRouter.get("/get-shop-by-city/:city", authenticate, getShopByCity);

export default shopRouter;
