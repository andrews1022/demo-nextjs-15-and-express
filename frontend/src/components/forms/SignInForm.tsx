"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type LoginResponseData = {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const dataToSend = {
      email,
      password,
    };
    console.log("dataToSend:", dataToSend);

    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ensures cookies are sent with the request
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Sign-in failed");
        return;
      }

      const responseData: LoginResponseData = await response.json();
      const { id } = responseData?.data?.user;

      if (id) {
        router.push(`/profile/${id}`);
      } else {
        setError("User ID not found in response");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Error during sign-in");
      } else {
        setError("Error during sign-in");
      }
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <form
      onSubmit={handleOnSubmit}
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
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" name="password" required />
      </div>

      <button type="submit">Sign In</button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </form>
  );
};

export default SignInForm;
