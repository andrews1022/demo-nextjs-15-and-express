"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

// define a type for the user profile data fetched from the backend
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const { user, token, isLoggedIn, isLoading, logout } = useAuth();

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    // if auth context is still loading, do nothing yet
    if (isLoading) {
      return;
    }

    // if not logged in after loading, redirect to sign-in
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }

    // if logged in, fetch profile data from backend
    const fetchProfile = async () => {
      setIsFetchingProfile(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the JWT in the Authorization header
          },
        });

        if (!response.ok) {
          // if the token is invalid or expired, the backend will return 401/403
          // In such cases, log the user out on the frontend
          if (response.status === 401 || response.status === 403) {
            console.error("Token invalid or expired, logging out...");

            // log out from context and then redirect to login
            logout();
            router.push("/sign-in");

            return;
          }

          const errorData = await response.json();

          throw new Error(errorData.message || "Failed to fetch profile data.");
        }

        const data: UserProfile = await response.json();

        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);

        setError((error as Error).message || "Could not load profile data.");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, isLoading, token, router, logout]);

  if (isLoading || isFetchingProfile) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if not logged in (and not loading), the redirect would have already happened
  // this check is mostly for typescript's sake after initial loading
  if (!user || !profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>

      <p>
        <strong>Name:</strong> {profileData.name}
      </p>

      <p>
        <strong>Email:</strong> {profileData.email}
      </p>
    </div>
  );
};

export default ProfilePage;
