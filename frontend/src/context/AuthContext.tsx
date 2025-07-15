"use client";

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define the shape of the user object that will be stored in the context
type UserAuthData = {
  id: string;
  name: string;
  email: string;
  // Add any other non-sensitive user properties you want accessible globally
};

// Define the shape of the AuthContext
type AuthContextType = {
  user: UserAuthData | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (userData: UserAuthData, jwtToken: string) => void;
  logout: () => void;
  isLoading: boolean; // To indicate if the initial auth state is being loaded
};

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
type AuthProviderProps = {
  children: ReactNode;
};

// AuthProvider component that manages the authentication state
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserAuthData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  // On initial load, try to retrieve token and user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser: UserAuthData = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        // Clear invalid data if parsing fails
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false); // Finished loading initial auth state
  }, []);

  // Function to handle user login
  const login = (userData: UserAuthData, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    localStorage.setItem("jwtToken", jwtToken); // Store token
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("jwtToken"); // Remove token
    // Optionally redirect to home or login page after logout
    window.location.href = "/sign-in"; // Or use Next.js useRouter().push('/')
  };

  const isLoggedIn = !!user && !!token; // Determine logged-in status

  const contextValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
