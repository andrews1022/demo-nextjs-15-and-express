"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "@/actions/signIn";
import { SignInFormSchema } from "@/lib/formSchemaDefinitions";
import type { SignInFormInputs } from "@/types/forms";

const SignInForm = () => {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (data: SignInFormInputs) => {
    setIsSubmitting(true);

    try {
      // Call the signIn server action which will:
      // - Perform some server-side validation
      // - Make the POST request to the sign-in API endpoint

      const resp = await signIn(data); // `data` is already validated

      // if the user tries to sign in with invalid credentials:
      if (resp?.errors) {
        setGeneralError(resp.errors);
        return;
      }

      router.push(`/profile/${resp?.userId}`);
    } catch (error) {
      console.error("Error during sign in:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        margin: "20px 0",
      }}
    >
      {generalError && <p style={{ color: "red" }}>{generalError}</p>}

      <div>
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" id="email" {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" {...register("password")} />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
      </div>

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
