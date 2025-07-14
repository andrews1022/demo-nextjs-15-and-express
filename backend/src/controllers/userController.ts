import { NextFunction, Request, Response } from "express";

import { UserService } from "@/services/userService";
import type { CreateUserInput } from "@/types/users";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserInput;

      // basic input validation
      if (!name || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const newUser = await userService.createUser({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
}
