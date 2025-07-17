import { NextFunction, Request, Response } from "express";

import { BadRequestError, NotFoundError } from "@/errors/customErrors";
import { UserService } from "@/services/userService";
import type { CreateUserInput } from "@/types/users";

const userService = new UserService();

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

      const { token, user } = await userService.registerUser({ name, email, password });

      res.status(201).json({
        data: {
          token,
          user,
        },
      });
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

      // Call the UserService to authenticate the user
      const { token, user } = await userService.loginUser(email, password);

      // Send back the user data and JWT
      res.status(200).json({
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  // Handles fetching user data by ID (GET /api/users/:id)
  // This route is protected by the authenticateToken middleware
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Validate that userId is provided
      if (!id) {
        throw new NotFoundError("User ID not found in request after authentication.");
      }

      // Call the UserService to get the user by ID
      // getUserById already returns user data without password
      const user = await userService.getUserById(id);

      if (!user) {
        throw new NotFoundError("User not found.");
      }

      // Send back the user data without the password
      res.status(200).json({
        data: {
          user,
        },
      });
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }
}
