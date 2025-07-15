import { Router } from "express";

import { UserController } from "@/controllers/userController";

const userRouter = Router();
const userController = new UserController();

// Route for user registration
userRouter.post("/register", userController.registerUser);

export { userRouter };
