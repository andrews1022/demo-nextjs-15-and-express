import { Router } from "express";
import { AuthController } from "@/controllers/authController";
// We will import the authentication middleware here later to protect /me
// import { authenticateToken } from "@/middlewares/authMiddleware";

const authRouter = Router();
const authController = new AuthController();

// Route for user login
authRouter.post("/login", authController.login);

// Route for fetching authenticated user's profile
// This route will be protected by authentication middleware
authRouter.get("/me", authController.getProfile); // Will add authenticateToken middleware here later

export { authRouter };
