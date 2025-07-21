import CreatePostForm from "@/components/forms/CreatePostForm";
import { verifySession } from "@/lib/session";

const ProfilePage = async () => {
  const session = await verifySession();

  return (
    <div>
      <h1>User Profile</h1>

      {session?.userName && <h2>Welcome back, {session.userName}!</h2>}
      <CreatePostForm />
    </div>
  );
};

export default ProfilePage;
