"use server"; // Indicates that all exported functions here are server actions

// import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Define the shape of the user data returned by the backend
type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

// Log in a user by making a POST request to the backend
// This function is used by a server action in a form
export async function login(formData: FormData) {
  // Use FormData to get the input values from the form
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Make a request to your backend's login endpoint
  const response = await fetch("http://localhost:4000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed.");
  }

  // The backend sets the HttpOnly cookie automatically, so no need to handle it here
  const userData = await response.json();
  // console.log("[auth.ts] userData: ", userData);
  // userData:  {
  //   user: {
  //     id: 'd92dbb41-3919-43ff-80ee-65eb9a0cf4c9',
  //     name: 'John Doe',
  //     email: 'johndoe1123@gmail.com',
  //     createdAt: '2025-07-15T23:30:27.402Z',
  //     updatedAt: '2025-07-15T23:30:27.402Z'
  //   }
  // }

  // Redirect the user to their specific dynamic profile page
  redirect(`/profile/${userData.user.id}`);
}

// Log out a user by making a POST request to the backend
export async function logout() {
  // Make a request to your backend's logout endpoint
  await fetch("http://localhost:4000/api/users/logout", {
    method: "POST",
  });

  // Redirect the user back to the home page
  redirect("/");
}

// Get the currently authenticated user's profile from the backend
// This function will be used by server components (like AppHeader and ProfilePage)
export async function getAuthenticatedUser(): Promise<UserProfile | null> {
  try {
    // The browser automatically sends the HttpOnly cookie with this request
    const response = await fetch("http://localhost:4000/api/users/me", {
      method: "GET",
      // It's important to set 'cache: "no-store"' or 'revalidate: 0' to ensure
      // the request is not cached and the user's auth status is always fresh
      cache: "no-store",
    });

    if (!response.ok) {
      // If the response is not ok (e.g., 401 Unauthorized), the user is not authenticated
      return null;
    }

    const user: UserProfile = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return null;
  }
}
