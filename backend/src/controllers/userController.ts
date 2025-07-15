import { NextFunction, Request, Response } from "express";

import { BadRequestError } from "@/errors/customErrors";
import { UserService } from "@/services/userService";
import type { CreateUserInput } from "@/types/users";

const userService = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserInput;

      // Input validation using BadRequestError
      if (!name || !email || !password) {
        // Throw a BadRequestError for missing required fields
        throw new BadRequestError("All fields (name, email, password) are required.");
      }

      const newUser = await userService.registerUser({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      // Pass any caught error (including custom HttpErrors from UserService) to the global error handler
      next(error);
    }
  }
}
