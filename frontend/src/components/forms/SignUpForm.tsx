"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { signUp } from "@/actions/signUp";

const SignUpForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, undefined);

  useEffect(() => {
    if (state?.userId) {
      router.push(`/profile/${state.userId}`);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
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
        <input type="text" id="name" name="name" />
        {state?.errors?.properties?.name && (
          <p style={{ color: "red" }}>{state.errors.properties.name.errors}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" id="email" name="email" />
        {state?.errors?.properties?.email && (
          <p style={{ color: "red" }}>{state.errors.properties.email.errors}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" name="password" />
        {state?.errors?.properties?.password && (
          <div style={{ color: "red" }}>
            <p>Password must:</p>
            <ul>
              {state.errors.properties.password.errors.map((error) => (
                <li key={error} style={{ listStyleType: "disc", marginLeft: "20px" }}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" style={{ display: "block" }}>
          Confirm Password
        </label>
        <input type="password" id="confirmPassword" name="confirmPassword" />
        {state?.errors?.properties?.confirmPassword && (
          <p style={{ color: "red" }}>{state.errors.properties.confirmPassword.errors}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
