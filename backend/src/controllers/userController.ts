import { NextFunction, Request, Response } from "express";

import { config } from "@/config";
import { BadRequestError, NotFoundError } from "@/lib/customErrors";
import { UserService } from "@/services/userService";
import type { CreateUserInput, DrizzleSelectUser, SignInUserInput } from "@/types/users";
import type { ExpressControllerResponse } from "@/types/controller";

const userService = new UserService();

// Define a common cookie options object
const cookieOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie
  secure: config.nodeEnv === "production", // Use secure in production (HTTPS)
  sameSite: "strict" as const, // Prevents CSRF attacks
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
};

type OmittedPasswordUserResponse = {
  user: Omit<DrizzleSelectUser, "password">;
};

export class UserController {
  // Handles user registration (POST /api/users/sign-up)
  // Creates a new user and returns the user data along with a JWT
  async signUpUser(
    req: Request<{}, {}, CreateUserInput>,
    res: Response<ExpressControllerResponse<OmittedPasswordUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Input validation using BadRequestError
      if (!name || !email || !password) {
        // Throw a BadRequestError for missing required fields
        throw new BadRequestError("All fields (name, email, password) are required.");
      }

      const { user, token } = await userService.signUpUser({ name, email, password });

      // Set the JWT as an HttpOnly cookie
      res.cookie(config.jwtName, token, cookieOptions);

      // We no longer need to send the token in the JSON body
      res.status(201).json({
        data: {
          user,
        },
      });
    } catch (error) {
      // Pass any caught error (including custom HttpErrors from UserService) to the global error handler
      next(error);
    }
  }

  // Handles user login (POST /api/users/sign-in)
  // Authenticates user and returns a JWT
  async signInUser(
    req: Request<{}, {}, SignInUserInput>,
    res: Response<ExpressControllerResponse<OmittedPasswordUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic validation for login credentials
      if (!email || !password) {
        throw new BadRequestError("Email and password are required.");
      }

      const { user, token } = await userService.signInUser(email, password);

      // Set the JWT as an HttpOnly cookie
      res.cookie(config.jwtName, token, cookieOptions);

      // We no longer need to send the token in the JSON body
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

  // Handles user logout by clearing the HttpOnly cookie
  async signOutUser(
    req: Request,
    res: Response<ExpressControllerResponse<{ message: string }>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Clear the cookie. The value doesn't matter, just the name and options.
      res.clearCookie(config.jwtName);

      res.status(200).json({
        data: {
          message: "Signed out successfully.",
        },
      });
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  // Handles fetching user data by ID (GET /api/users/:id)
  // This route is protected by the authenticateToken middleware
  async getUserById(
    req: Request,
    res: Response<ExpressControllerResponse<OmittedPasswordUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      // The user ID from the JWT is now available on req.user.id
      const userIdFromToken = (req as any).user?.id; // will be typed properly in the middleware
      const userIdFromParams = req.params.id;

      // Ensure the user requesting the profile matches the token's user ID
      if (userIdFromToken !== userIdFromParams) {
        throw new BadRequestError("Access to this profile is forbidden.");
      }

      // Call the UserService to get the user by ID
      // getUserById already returns user data without password
      const user = await userService.getUserById(userIdFromParams);

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
