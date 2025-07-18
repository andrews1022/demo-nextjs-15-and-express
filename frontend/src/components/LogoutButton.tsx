"use client";

type LogoutButtonProps = {
  handleOnClick: () => Promise<void>;
};

const LogoutButton = ({ handleOnClick }: LogoutButtonProps) => {
  return (
    <button
      onClick={handleOnClick}
      style={{
        background: "none",
        border: "1px solid #666",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
