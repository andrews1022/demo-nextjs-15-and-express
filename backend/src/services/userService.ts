import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";

import type { CreateUserInput, User } from "@/types/users";

export class UserService {
  async createUser(userData: CreateUserInput): Promise<User> {
    const [insertedUser] = await db.insert(usersTable).values(userData).returning();

    if (!insertedUser) {
      throw new Error("Failed to create user");
    }

    return insertedUser;
  }
}
