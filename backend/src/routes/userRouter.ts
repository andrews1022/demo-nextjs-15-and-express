import { Router } from "express";

import { UserController } from "@/controllers/userController";
import { authenticateToken } from "@/middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();

// Route for user sign-up
userRouter.post("/sign-up", userController.signUpUser);

// Route for user sign-in
userRouter.post("/sign-in", userController.signInUser);

// Route for user sign-out
userRouter.post("/sign-out", userController.signOutUser);

// Route for getting user data by id (protected route)
userRouter.get("/:id", authenticateToken, userController.getUserById);

export { userRouter };
