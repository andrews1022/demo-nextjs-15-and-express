import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema/users";
import { BadRequestError, ConflictError, HttpError, InternalServerError } from "@/lib/customErrors";
import { generateToken } from "@/lib/jwt";
import type { CreateUserInput, DrizzleSelectUser } from "@/types/users";

const BCRYPT_SALT_ROUNDS = 10;

// Define a type for the successful authentication response
// This is what loginUser and registerUser will return
export type AuthResponse = {
  user: Omit<DrizzleSelectUser, "password">; // User data without the password
  token: string;
};

export class UserService {
  // method to create a new user (and log them in automatically)
  async signUpUser(userData: CreateUserInput): Promise<AuthResponse> {
    const { password, ...restUserData } = userData;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    try {
      // attempt to insert the user with the hashed password
      const [insertedUser] = await db
        .insert(usersTable)
        .values({
          ...restUserData,
          password: hashedPassword,
        })
        .returning();

      if (!insertedUser) {
        throw new InternalServerError("Failed to create user: No user data returned after insert.");
      }

      // omit the password from the returned user object
      const { password: _, ...userWithoutPassword } = insertedUser;

      // generate jwt for the newly registered user
      const token = generateToken({ userId: userWithoutPassword.id });

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error: any) {
      console.log("register user error", JSON.stringify(error, null, 2));

      // check if it's a unique constraint violation error (PostgreSQL error code '23505')
      if (error && error.code === "23505") {
        console.error("Database unique constraint violation:", error.detail);
        throw new ConflictError("Email already registered. Please use a different email.", {
          field: "email",
        });
      }

      console.error("Error during user registration:", error);
      throw new InternalServerError("Failed to register user due to an unexpected database error.");
    }
  }

  // method to log in an existing user
  async signInUser(email: string, plainTextPassword: string): Promise<AuthResponse> {
    try {
      // find the user by email
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

      if (!user) {
        // use BadRequestError for "invalid credentials" to avoid leaking whether email exists
        throw new BadRequestError("Invalid credentials.");
      }

      const isPasswordValid = await bcrypt.compare(plainTextPassword, user.password);

      if (!isPasswordValid) {
        // use BadRequestError for "invalid credentials"
        throw new BadRequestError("Invalid credentials.");
      }

      // omit the password before returning and generating the token
      const { password: _, ...userWithoutPassword } = user;

      // generate jwt for the authenticated user
      const token = generateToken({ userId: userWithoutPassword.id });

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error: any) {
      // re-throw HttpErrors directly
      if (error instanceof HttpError) {
        throw error;
      }

      console.error("Error during user login:", error);
      throw new InternalServerError("Login failed due to an unexpected server error.");
    }
  }

  // method to get a user by ID
  // return the user data without their password
  async getUserById(userId: string): Promise<Omit<DrizzleSelectUser, "password"> | undefined> {
    const [result] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (result) {
      const { password: _, ...userWithoutPassword } = result;
      return userWithoutPassword;
    }

    return undefined;
  }
}
