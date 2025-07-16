"use client";

import { useFormStatus } from "react-dom";
import { login } from "@/lib/auth";

const SignInForm = () => {
  const { pending } = useFormStatus();

  return (
    <form
      action={login} // the form handles submission with the 'login' server action
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        margin: "20px 0",
      }}
    >
      <div>
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" id="email" name="email" required disabled={pending} />
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" name="password" required disabled={pending} />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{ padding: "0.125rem 0.75rem", cursor: "pointer" }}
      >
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
