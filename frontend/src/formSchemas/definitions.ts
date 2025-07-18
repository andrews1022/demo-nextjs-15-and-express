import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  .trim();

export const SignUpFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: passwordSchema,
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInFormSchema = z.object({
  email: z.string(),
  password: z.string().min(6).max(100),
});
