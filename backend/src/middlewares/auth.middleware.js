import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/index.js";
import UserModel from "../models/User.model.js";
import ErrorResponse from "../utils/ApiError.util.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) return next(new ErrorResponse(`Please login`, 401));

    let decodedToken = jwt.verify(token, JWT_SECRET_KEY);

    let user = await UserModel.findById(decodedToken.payload);
    if (!user) return next(new ErrorResponse(`Invalid Session`, 401));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
