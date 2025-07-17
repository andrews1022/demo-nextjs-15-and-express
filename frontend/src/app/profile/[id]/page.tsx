import { cookies } from "next/headers";
import CreatePostForm from "@/components/forms/CreatePostForm";

type ProfileResponseData = {
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

const getUserData = async (id: string): Promise<ProfileResponseData | null> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`http://localhost:4000/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // forward cookies to backend
      },
      credentials: "include", // ensures cookies are sent with the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch user data");
    }

    const data = await response.json();
    // console.log("data: ", data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user data:", error.message);
    } else {
      console.error("Unexpected error fetching user data:", error);
    }
    return null;
  }
};

type ProfilePageProps = {
  params: {
    id: string;
  };
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;
  const user = await getUserData(id);

  return (
    <div>
      <h1>User Profile</h1>
      {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
      {user && user.data.user && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Name:</strong> {user.data.user.name}
        </div>
      )}
      <CreatePostForm />
    </div>
  );
};

export default ProfilePage;
