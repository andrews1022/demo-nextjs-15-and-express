import { db } from "@/drizzle/db";
import { usersTable } from "@/drizzle/schema";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export class UserService {
  async createUser(userData: CreateUserInput): Promise<User> {
    const [insertedUser] = await db.insert(usersTable).values(userData).returning();

    if (!insertedUser) {
      throw new Error("Failed to create user");
    }

    return insertedUser;
  }
}
