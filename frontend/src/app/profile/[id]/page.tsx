import CreatePostForm from "@/components/forms/CreatePostForm";

const ProfilePage = () => {
  // const { id } = await params;
  // const user = await getUserData(id);

  return (
    <div>
      <h1>User Profile</h1>
      {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
      {/* {user && user.data.user && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Name:</strong> {user.data.user.name}
        </div>
      )} */}
      <CreatePostForm />
    </div>
  );
};

export default ProfilePage;
