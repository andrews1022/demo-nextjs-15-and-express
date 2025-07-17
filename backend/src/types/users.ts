import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { usersTable } from "@/drizzle/schema/users";

export type DrizzleInsertUser = InferInsertModel<typeof usersTable>;
// type DrizzleInsertUser = {
//   id?: string | undefined;
//   name: string;
//   email: string;
//   password: string;
//   createdAt?: Date | undefined;
//   updatedAt?: Date | undefined;
// };

export type DrizzleSelectUser = InferSelectModel<typeof usersTable>;
// type DrizzleSelectUser = {
//     id: string;
//     name: string;
//     email: string;
//     password: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};
