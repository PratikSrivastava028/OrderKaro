import { Router } from "express";
import { currentUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/current-user", authenticate, currentUser);

export default userRouter;
