import { Router } from "express";

import { AuthController } from "@/controllers/authController";
import { authenticateToken } from "@/middlewares/authMiddleware";

const authRouter = Router();
const authController = new AuthController();

// Route for user login
authRouter.post("/login", authController.login);

// Route for fetching authenticated user's profile
// This route is now protected by the authenticateToken middleware
authRouter.get("/me", authenticateToken, authController.getProfile);

export { authRouter };
