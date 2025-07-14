import bcrypt from "bcryptjs";

import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";

import type { CreateUserInput, User } from "@/types/users";

const BCRYPT_SALT_ROUNDS = 10;

export class UserService {
  async createUser(userData: CreateUserInput): Promise<User> {
    // destructure to separate password
    const { password, ...restUserData } = userData;

    // has the password BEFORE inserting into the database
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // create the user in the database with the hashed password
    const [insertedUser] = await db
      .insert(usersTable)
      .values({
        ...restUserData,
        password: hashedPassword,
      })
      .returning();

    if (!insertedUser) {
      throw new Error("Failed to create user");
    }

    // omit the password from the returned user object before sending it back to the client
    const { password: _, ...userWithoutPassword } = insertedUser;

    return userWithoutPassword as User; // Cast back to User type
  }
}
