import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { postsTable } from "@/drizzle/schema/posts";

export type DrizzleInsertPost = InferInsertModel<typeof postsTable>;
// {
//   id?: string | undefined;
//   title: string;
//   content: string;
//   userId: string;
//   createdAt?: Date | undefined;
//   updatedAt?: Date | undefined;
// }

export type DrizzleSelectPost = InferSelectModel<typeof postsTable>;
// {
//   id: string;
//   title: string;
//   content: string;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
