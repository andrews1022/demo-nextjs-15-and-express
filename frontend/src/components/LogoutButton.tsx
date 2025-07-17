"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include", // ensures cookies are sent with the request
      });

      if (response.ok) {
        router.push("/");
      } else {
        setError("Logout failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      }
      setError("Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        background: "none",
        border: "1px solid #666",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loading ? "Logging out..." : "Logout"}
      {error && <span style={{ color: "red", marginLeft: "10px" }}>{error}</span>}
    </button>
  );
};

export default LogoutButton;
