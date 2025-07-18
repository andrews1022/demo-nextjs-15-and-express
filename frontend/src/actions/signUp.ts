"use server";

import z from "zod";

import { SignUpFormSchema } from "@/formSchemas/definitions";
import { createSession } from "@/sesh/session";

type SignUpErrors =
  | {
      errors: string[];
    }
  | undefined;

type SignUpState =
  | {
      errors: {
        errors: string[];
        properties?: {
          name?: SignUpErrors;
          email?: SignUpErrors;
          password?: SignUpErrors;
          confirmPassword?: SignUpErrors;
        };
      };
      userId?: undefined;
    }
  | {
      userId: string;
      errors?: undefined;
    }
  | undefined;

// circular reference ??
// type Test = Awaited<ReturnType<typeof signUp>>;

export const signUp = async (state: SignUpState, formData: FormData) => {
  // 1. Validate fields
  const validationResult = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validationResult.success) {
    return {
      errors: z.treeifyError(validationResult.error),
    };
  }

  // 2. Register user (make API request to Express server)
  const { name, email, password } = validationResult.data;

  try {
    const response = await fetch("http://localhost:4000/api/users/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    // 3. Create session
    const registeredUserData = await response.json();

    await createSession(registeredUserData.data.user.id);

    return {
      userId: registeredUserData.data.user.id,
    };
  } catch (error) {
    console.error("Error signing up:", error);
  }
};
