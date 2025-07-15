import bcrypt from "bcryptjs";

import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";
import { ConflictError, InternalServerError } from "@/errors/customErrors";
import type { CreateUserInput, User } from "@/types/users";

const BCRYPT_SALT_ROUNDS = 10;

export class UserService {
  // method for password verification (e.g., during login)
  async verifyPassword(plainTextPassword: string, hashedPasswordFromDb: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPasswordFromDb);
  }

  // method to create a new user
  async registerUser(userData: CreateUserInput): Promise<User> {
    const { password, ...restUserData } = userData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    try {
      // Attempt to insert the user with the hashed password
      const [insertedUser] = await db
        .insert(usersTable)
        .values({
          ...restUserData,
          password: hashedPassword,
        })
        .returning(); // .returning() will return the inserted row

      if (!insertedUser) {
        // If no user data is returned after insert (highly unlikely for a successful insert)
        throw new InternalServerError("Failed to create user: No user data returned after insert.");
      }

      // omit the password from the returned user object before sending it back to the client
      const { password: _, ...userWithoutPassword } = insertedUser;

      return userWithoutPassword as User;
    } catch (error: any) {
      // Type 'any' used for simplicity, consider type guards for robustness
      console.log("create user error", JSON.stringify(error, null, 2));

      // Catch potential errors from the database
      // Check if it's a unique constraint violation error (PostgreSQL error code '23505')
      if (error && error.cause.code === "23505") {
        // Drizzle's underlying error often has .code property
        // Log the full database error for debugging
        console.error("Database unique constraint violation:", error.detail);
        // Throw a specific ConflictError for the frontend to handle
        throw new ConflictError("Email already registered. Please use a different email.", {
          field: "email",
        });
      }

      // For any other unexpected errors, throw a generic InternalServerError
      console.error("Error creating user:", error); // Log the full error for debugging
      throw new InternalServerError("Failed to create user due to an unexpected database error.");
    }
  }

  // we could also add methods here for:
  // - find user by email --> findUserByEmail(email: string): Promise<User | undefined>
  // - find user by id --> findUserById(id: string): Promise<User | undefined>
  // - update user password --> updateUserPassword(id: string, newPassword: string): Promise<void>
  // etc.
}
