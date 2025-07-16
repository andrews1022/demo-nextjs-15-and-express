"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "@/hooks/useAuth";

const SignInForm = () => {
  // State for form input values
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // State for button disabled status
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Access auth context and router
  const { login, isLoggedIn } = useAuth(); // Also get isLoggedIn to potentially redirect if already logged in
  const router = useRouter();

  // Redirect if already logged in (optional, but good UX)
  useEffect(() => {
    if (isLoggedIn && !isSubmitting) {
      // Ensure not redirecting while a login attempt is underway
      router.push("/profile");
    }
  }, [isLoggedIn, isSubmitting, router]);

  useEffect(() => {
    // Disable the button if any input is empty
    setIsButtonDisabled(!emailInput || !passwordInput);
  }, [emailInput, passwordInput]);

  // State for validation errors
  const [errors, setErrors] = useState({
    emailInputError: "",
    passwordInputError: "",
    generalError: "",
  });

  const resetInputs = () => {
    setEmailInput("");
    setPasswordInput("");
  };

  const resetErrors = () => {
    setErrors({
      emailInputError: "",
      passwordInputError: "",
      generalError: "",
    });
  };

  const handleInputValidation = () => {
    let isValid = true;
    const newErrors = {
      emailInputError: "",
      passwordInputError: "",
      generalError: "",
    };

    if (!emailInput.trim()) {
      newErrors.emailInputError = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailInput)) {
      newErrors.emailInputError = "Email is invalid.";
      isValid = false;
    }

    if (!passwordInput) {
      newErrors.passwordInputError = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();

    const isValid = handleInputValidation();

    if (!isValid) {
      setErrors((prev) => {
        return {
          ...prev,
          generalError: "Please correct the errors above before submitting.",
        };
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Backend error response:", responseData);

        if (responseData.message) {
          setErrors((prev) => {
            return {
              ...prev,
              generalError: responseData.message,
            };
          });
        } else {
          setErrors((prev) => {
            return {
              ...prev,
              generalError: "An unexpected error occurred during login. Please try again.",
            };
          });
        }
        return;
      }

      // Call the login function from AuthContext to update global state and store token
      login(responseData.user, responseData.token);

      // Clear form fields
      resetInputs();
      resetErrors();

      // Redirect to the profile page
      router.push("/profile");
    } catch (error) {
      console.error("Network error during login:", error);

      setErrors((prev) => {
        return {
          ...prev,
          generalError:
            "Network error: Could not connect to the server. Please check your internet connection.",
        };
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn && !isSubmitting) {
    // If already logged in, you might choose to show nothing or a "Already logged in" message briefly
    return null; // Component will unmount or redirect due to useEffect
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        <input
          type="email"
          id="email"
          name="email"
          required
          value={emailInput}
          onChange={(event) => setEmailInput(event.target.value)}
        />
        {errors.emailInputError && (
          <p style={{ color: "red", fontSize: "0.8em", margin: "5px 0 0 0" }}>
            {errors.emailInputError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
        />
        {errors.passwordInputError && (
          <p style={{ color: "red", fontSize: "0.8em", margin: "5px 0 0 0" }}>
            {errors.passwordInputError}
          </p>
        )}
      </div>

      <button disabled={isButtonDisabled || isSubmitting} type="submit">
        {isSubmitting ? "Loading..." : "Sign In"}
      </button>

      {errors.generalError && (
        <p style={{ color: "red", margin: "10px 0 0 0" }}>{errors.generalError}</p>
      )}
    </form>
  );
};

export default SignInForm;
