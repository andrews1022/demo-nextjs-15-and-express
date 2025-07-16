"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

const AppHeader = () => {
  const { isLoading, isLoggedIn, logout, user } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    // log out from context and then redirect to login
    logout();
    router.push("/sign-in");
  };

  // don't render anything until the initial auth state is loaded
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <header>
      <nav>
        <ul style={{ display: "flex", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {!isLoggedIn && (
            <>
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <>
              <li>
                <Link href={`/profile/${user?.id}`}>Profile</Link>
              </li>
              <li>
                {user && (
                  <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                    Hello, {user.name}!
                  </span>
                )}
                <button
                  onClick={handleLogout}
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
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
