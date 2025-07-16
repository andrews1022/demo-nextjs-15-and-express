import { NextFunction, Request, Response } from "express";

import { config } from "@/config";
import { BadRequestError, ConflictError, NotFoundError } from "@/errors/customErrors";
import { UserService } from "@/services/userService";
import type { CreateUserInput } from "@/types/users";

const userService = new UserService();

// Define a common cookie options object
const cookieOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie
  secure: config.nodeEnv === "production", // Use secure in production (HTTPS)
  sameSite: "strict" as const, // Prevents CSRF attacks
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
};

export class UserController {
  // Handles user registration (POST /api/users/register)
  // Creates a new user and returns the user data along with a JWT
  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserInput;

      // Input validation using BadRequestError
      if (!name || !email || !password) {
        // Throw a BadRequestError for missing required fields
        throw new BadRequestError("All fields (name, email, password) are required.");
      }

      const { user, token } = await userService.registerUser({ name, email, password });

      // Set the JWT as an HttpOnly cookie
      res.cookie("jwt", token, cookieOptions);

      // We no longer need to send the token in the JSON body
      res.status(201).json({ user });
    } catch (error) {
      // Pass any caught error (including custom HttpErrors from UserService) to the global error handler
      next(error);
    }
  }

  // Handles user login (POST /api/users/login)
  // Authenticates user and returns a JWT
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic validation for login credentials
      if (!email || !password) {
        throw new BadRequestError("Email and password are required.");
      }

      const { user, token } = await userService.loginUser(email, password);

      // Set the JWT as an HttpOnly cookie
      res.cookie("jwt", token, cookieOptions);

      // We no longer need to send the token in the JSON body
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  // Handles user logout by clearing the HttpOnly cookie
  async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear the cookie. The value doesn't matter, just the name and options.
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  // Handles fetching user data by ID (GET /api/users/:id)
  // This route is protected by the authenticateToken middleware
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // The user ID from the JWT is now available on req.user.id
      const userIdFromToken = (req as any).user?.id; // will be typed properly in the middleware
      const { id } = req.params;

      // Ensure the user requesting the profile matches the token's user ID
      if (userIdFromToken !== id) {
        throw new BadRequestError("Access to this profile is forbidden.");
      }

      // Call the UserService to get the user by ID
      // getUserById already returns user data without password
      const user = await userService.getUserById(id);

      if (!user) {
        throw new NotFoundError("User not found.");
      }

      // Send back the user data without the password
      res.status(200).json(user);
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }
}
