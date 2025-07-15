import { Router } from "express";

import { UserController } from "@/controllers/userController";

const userRouter = Router();
const userController = new UserController();

/*
  User Routes (/user set in app.ts)
  - POST /register - Register a new user
  - POST /login - Login an existing user (not implemented yet)
  - POST /logout - Logout a user (not implemented yet)
  - POST /forgot-password - Handle forgot password (not implemented yet)
  - POST /reset-password - Handle reset password (not implemented yet)
  - GET /:id - Get user by ID (not implemented yet)
  - PUT /:id - Update user by ID (not implemented yet)
  - DELETE /:id - Delete user by ID (not implemented yet)
*/
userRouter.post("/register", userController.registerUser);

export { userRouter };
