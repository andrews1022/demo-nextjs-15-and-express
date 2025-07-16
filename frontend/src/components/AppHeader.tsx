import Link from "next/link";

import { getAuthenticatedUser, logout } from "@/lib/auth";

const AppHeader = async () => {
  const user = await getAuthenticatedUser();

  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav>
        <ul style={{ display: "flex", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {user ? (
            <>
              {/* If user is logged in, link to their specific dynamic profile route */}
              <li>
                <Link href={`/profile/${user.id}`}>Profile</Link>
              </li>
              <li>
                <form action={logout}>
                  <button
                    type="submit"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "blue",
                    }}
                  >
                    Logout
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
