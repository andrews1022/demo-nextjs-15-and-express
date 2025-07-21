"use server";

import z from "zod";

import { baseExpressApiUrl } from "@/lib/apiUrl";
import { SignUpFormSchema } from "@/lib/formSchemaDefinitions";
import { createSession } from "@/lib/session";
import type { SignUpFormInputs } from "@/types/forms";

export const signUp = async (input: SignUpFormInputs) => {
  // 1. Validate user input on the server
  const validationResult = SignUpFormSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      errors: z.treeifyError(validationResult.error),
    };
  }

  // 2. Register the user (make the API request to Express server)
  const { name, email, password } = validationResult.data;

  try {
    const response = await fetch(`${baseExpressApiUrl}/users/sign-up`, {
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

    // 3. Create the session
    const registeredUserData = await response.json();

    const userSessionData = {
      userId: registeredUserData.data.user.id,
      userName: registeredUserData.data.user.name,
    };

    await createSession(userSessionData);

    // return the user ID so we can redirect to the profile page
    return {
      userId: registeredUserData.data.user.id,
    };
  } catch (error) {
    console.error("Error signing up:", error);
  }
};
