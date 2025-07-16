"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "@/hooks/useAuth";

const SignUpForm = () => {
  // state for form input values
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // state for button disabled status
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // access auth context and router
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // disable the button if any input is empty, or if passwords do not match
    const isAnyInputEmpty = !nameInput || !emailInput || !passwordInput || !confirmPasswordInput;
    const doPasswordsMatch = passwordInput === confirmPasswordInput;

    setIsButtonDisabled(isAnyInputEmpty || !doPasswordsMatch);
  }, [nameInput, emailInput, passwordInput, confirmPasswordInput]);

  // state for validation errors
  const [errors, setErrors] = useState({
    nameInputError: "",
    emailInputError: "",
    passwordInputError: "",
    confirmPasswordInputError: "",
    generalError: "",
  });

  const resetInputs = () => {
    setNameInput("");
    setEmailInput("");
    setPasswordInput("");
    setConfirmPasswordInput("");
  };

  const resetErrors = () => {
    setErrors({
      nameInputError: "",
      emailInputError: "",
      passwordInputError: "",
      confirmPasswordInputError: "",
      generalError: "",
    });
  };

  const handleInputValidation = () => {
    // flag to track overall form validity
    let isValid = true;

    const newErrors = {
      // initialize newErrors based on current state
      nameInputError: "",
      emailInputError: "",
      passwordInputError: "",
      confirmPasswordInputError: "",
      generalError: "",
    };

    // --- Client-Side Validation Checks ---
    if (!nameInput.trim()) {
      newErrors.nameInputError = "Name is required.";
      isValid = false;
    }

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
    } else if (passwordInput.length < 6) {
      newErrors.passwordInputError = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!confirmPasswordInput) {
      newErrors.confirmPasswordInputError = "Confirm Password is required.";
      isValid = false;
    }

    if (passwordInput && confirmPasswordInput && passwordInput !== confirmPasswordInput) {
      newErrors.confirmPasswordInputError = "Passwords do not match.";
      isValid = false;
    }

    // update the error state
    setErrors(newErrors);

    // return the overall validity status
    return isValid;
  };

  // function to handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // reset errors at the start of each submission attempt
    resetErrors();

    const isValid = handleInputValidation();

    if (!isValid) {
      // If client-side validation fails, stop here
      setErrors((prev) => {
        return {
          ...prev,
          generalError: "Please correct the errors above before submitting.",
        };
      });

      return;
    }

    // set submitting state to true ONLY if client-side validation passes
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
        }),
      });

      // always parse json, even on error
      const responseData = await response.json();

      if (!response.ok) {
        // backend sent an error response (e.g., 400, 409, 500)
        console.error("Backend error response:", responseData);

        // check the error details to update specific input errors
        if (responseData.details && responseData.details.field === "email") {
          setErrors((prev) => {
            return {
              ...prev,
              emailInputError: responseData.message,
            };
          });
        } else if (responseData.message) {
          // for other specific messages not tied to a field, or generic bad request
          setErrors((prev) => {
            return {
              ...prev,
              generalError: responseData.message,
            };
          });
        } else {
          // fallback for unexpected error formats
          setErrors((prev) => ({
            ...prev,
            generalError: "An unexpected error occurred. Please try again.",
          }));
        }

        // stop execution if there was a backend error
        return;
      }

      // call the login function from AuthContext to update global state and store token
      login(responseData.user, responseData.token);

      // clear the form fields after successful submission and reset errors
      resetInputs();
      resetErrors();

      // redirect to the profile page
      router.push(`/profile/${responseData.user.id}`);
    } catch (error) {
      // this catch block handles network errors (e.g., server unreachable, CORS issues)
      console.error("Network error:", error);

      setErrors((prev) => {
        return {
          ...prev,
          generalError:
            "Network error: Could not connect to the server. Please check your internet connection.",
        };
      });
    } finally {
      // reset the submitting state after the request is complete, regardless of success or failure
      setIsSubmitting(false);
    }
  };

  // function to handle blur on the confirm password field
  const handleConfirmPasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // only validate on blur if both password fields have content
    if (passwordInput && event.target.value) {
      const doesntMatch = event.target.value !== passwordInput;

      setErrors((prev) => {
        return {
          ...prev,
          confirmPasswordInputError: doesntMatch ? "Passwords do not match." : "",
        };
      });
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
          onBlur={handleConfirmPasswordBlur}
          onChange={(event) => setConfirmPasswordInput(event.target.value)}
        />
        {errors.confirmPasswordInputError && (
          <p style={{ color: "red" }}>{errors.confirmPasswordInputError}</p>
        )}
      </div>

      <button disabled={isButtonDisabled || isSubmitting} type="submit">
        {isSubmitting ? "Loading..." : "Sign Up"}
      </button>

      {errors.generalError && <p style={{ color: "red" }}>{errors.generalError}</p>}
    </form>
  );
};

export default SignUpForm;
