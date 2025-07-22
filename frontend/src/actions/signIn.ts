"use server";

import z from "zod";

import { baseExpressApiUrl } from "@/lib/apiUrl";
import { SignInFormSchema } from "@/lib/formSchemaDefinitions";
import { createSession } from "@/lib/session";

import { SignInFormInputs } from "@/types/forms";

export const signIn = async (input: SignInFormInputs) => {
  // 1. Validate user input on the server
  const validationResult = SignInFormSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      errors: z.treeifyError(validationResult.error),
    };
  }

  // 2. Sign in user
  const { email, password } = validationResult.data;

  try {
    const response = await fetch(`${baseExpressApiUrl}/users/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // 3. Create session
    const signedInUserData = await response.json();

    const userSessionData = {
      userId: signedInUserData.data.user.id,
      userName: signedInUserData.data.user.name,
    };
    await createSession(userSessionData);

    // return the user ID so we can redirect to the profile page
    return {
      userId: signedInUserData.data.user.id,
    };
  } catch (error) {
    console.error("Error signing in:", error);
  }
};
