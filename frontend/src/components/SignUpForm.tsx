"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const SignUpForm = () => {
  // State for form input values
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({
    nameInputError: "",
    emailInputError: "",
    passwordInputError: "",
    confirmPasswordInputError: "",
    generalError: "",
  });

  // Function to handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Reset errors at the start of each submission attempt
    setErrors({
      nameInputError: "",
      emailInputError: "",
      passwordInputError: "",
      confirmPasswordInputError: "",
      generalError: "",
    });

    let isValid = true; // Flag to track overall form validity
    const newErrors = { ...errors }; // Create a mutable copy of errors

    // --- Validation Checks ---
    // 1. All fields have a valid input (simple empty check for now)
    if (!nameInput.trim()) {
      newErrors.nameInputError = "Name is required.";
      isValid = false;
    }

    if (!emailInput.trim()) {
      newErrors.emailInputError = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailInput)) {
      // Basic email format validation
      newErrors.emailInputError = "Email is invalid.";
      isValid = false;
    }

    if (!passwordInput) {
      newErrors.passwordInputError = "Password is required.";
      isValid = false;
    }

    if (!confirmPasswordInput) {
      newErrors.confirmPasswordInputError = "Confirm Password is required.";
      isValid = false;
    }

    // 2. passwords match
    if (passwordInput && confirmPasswordInput && passwordInput !== confirmPasswordInput) {
      newErrors.confirmPasswordInputError = "Passwords do not match.";
      isValid = false;
    }

    // update the error state
    setErrors(newErrors);

    if (isValid) {
      console.log("Form is valid! Submitting data:", { nameInput, emailInput, passwordInput });

      // clear the form fields after successful submission
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
      setConfirmPasswordInput("");
    }
  };

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
        <label htmlFor="name" style={{ display: "block" }}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
        />
        {errors.nameInputError && <p style={{ color: "red" }}>{errors.nameInputError}</p>}
      </div>

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
        {errors.emailInputError && <p style={{ color: "red" }}>{errors.emailInputError}</p>}
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
        {errors.passwordInputError && <p style={{ color: "red" }}>{errors.passwordInputError}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" style={{ display: "block" }}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          value={confirmPasswordInput}
          onBlur={(event) => {
            const doesntMatch = event.target.value !== passwordInput;

            setErrors((prev) => ({
              ...prev,
              confirmPasswordInput: doesntMatch ? "Passwords do not match." : "",
            }));
          }}
          onChange={(event) => setConfirmPasswordInput(event.target.value)}
        />
        {errors.confirmPasswordInputError && (
          <p style={{ color: "red" }}>{errors.confirmPasswordInputError}</p>
        )}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
