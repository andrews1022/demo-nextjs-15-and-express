import { NextFunction, Request, Response } from "express";

import { BadRequestError, NotFoundError } from "@/errors/customErrors";
import { UserService } from "@/services/userService";

const userService = new UserService();

export class AuthController {
  // Handles user login (POST /api/auth/login).
  // Authenticates user and returns a JWT.
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic validation for login credentials
      if (!email || !password) {
        throw new BadRequestError("Email and password are required.");
      }

      // Call the UserService to authenticate the user
      const authResponse = await userService.loginUser(email, password);

      // Send back the user data and JWT
      res.status(200).json(authResponse);
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  // handles fetching the authenticated user's profile (GET /api/auth/me).
  // this route will be protected by an authentication middleware.
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // the user id should be available on req.user after authentication middleware runs
      // we'll define this type augmentation later when creating the middleware
      const userId = (req as any).user?.id; // Temporarily cast to any, will type properly later

      if (!userId) {
        // this should ideally not happen if middleware works correctly
        // but good for robustness
        throw new NotFoundError("User ID not found in request after authentication.");
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        throw new NotFoundError("User profile not found.");
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // You might add other auth-related methods here like:
  // async logout(req: Request, res: Response, next: NextFunction): Promise<void> { ... }
  // async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> { ... }
  // async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> { ... }
}
