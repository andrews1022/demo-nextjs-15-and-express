import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import { deleteSession, verifySession } from "@/lib/sessionUtils";

const AppHeader = async () => {
  const session = await verifySession();

  const handleLogout = async () => {
    "use server";

    await deleteSession();
  };

  return (
    <header>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <nav>
        <ul style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {!session?.userId && (
            <>
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>

              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </>
          )}

          {session?.userId && (
            <>
              <li>
                <Link href={`/profile/${session.userId}`}>Profile</Link>
              </li>

              <li>
                <LogoutButton handleOnClick={handleLogout} />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
