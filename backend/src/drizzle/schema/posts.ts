import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "@/drizzle/schema/users";

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
