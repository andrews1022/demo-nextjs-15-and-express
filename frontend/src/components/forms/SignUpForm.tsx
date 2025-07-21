"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUp } from "@/actions/signUp";
import { SignUpFormSchema } from "@/lib/formSchemaDefinitions";
import type { SignUpFormInputs } from "@/types/forms";

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleOnSubmit = async (data: SignUpFormInputs) => {
    setIsSubmitting(true);

    try {
      // Call the signUp server action which will:
      // - Perform some server-side validation
      // - Make the POST request to the sign-up API endpoint

      const resp = await signUp(data); // `data` is already validated
      router.push(`/profile/${resp?.userId}`);
    } catch (error) {
      console.error("Error during sign up:", error);
      // Handle error appropriately, e.g., show a notification like a toast
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
      <div>
        <label htmlFor="name" style={{ display: "block" }}>
          Name
        </label>
        <input type="text" id="name" {...register("name")} />
        {errors.name?.message && <p style={{ color: "red" }}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" id="email" {...register("email")} />
        {errors.email?.message && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" {...register("password")} />
        {errors.password?.message && <p style={{ color: "red" }}>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" style={{ display: "block" }}>
          Confirm Password
        </label>
        <input type="password" id="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword?.message && (
          <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
