import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/auth";

// Define the component props to accept the dynamic route parameters
interface ProfilePageProps {
  params: {
    id: string; // The user ID from the URL
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const userIdFromUrl = params.id;

  // Fetch the authenticated user's data from the backend
  const user = await getAuthenticatedUser();

  console.log("user: ", user);

  // If no user is authenticated, redirect to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // Security check: Verify that the ID from the URL matches the user ID from the session
  if (user.id !== userIdFromUrl) {
    // If they don't match, redirect the user to their own profile page
    // This prevents a security vulnerability where a user could view another's profile
    redirect(`/profile/${user.id}`);
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "5rem auto",
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h1>User Profile</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default ProfilePage;
