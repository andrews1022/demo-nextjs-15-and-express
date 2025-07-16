import { Router } from "express";

import { UserController } from "@/controllers/userController";
import { authenticateToken } from "@/middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();

// Route for user registration
userRouter.post("/register", userController.registerUser);

// Route for user login
userRouter.post("/login", userController.loginUser);

// Route for user logout
userRouter.post("/logout", userController.logoutUser);

// Route for getting the current authenticated user's profile
userRouter.get("/me", authenticateToken, userController.getAuthenticatedUser);

// Route for getting user data by id (protected route)
userRouter.get("/:id", authenticateToken, userController.getUserById);

export { userRouter };
