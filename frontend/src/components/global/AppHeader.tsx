import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import LogoutButton from "@/components/LogoutButton";

// You must set this to your backend JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

const getUserFromCookie = async (): Promise<JWTPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt");

  if (!token || !JWT_SECRET) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification failed:", error.message);
    }

    return null;
  }
};

const AppHeader = async () => {
  const user = await getUserFromCookie();

  return (
    <header>
      <nav>
        <ul style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {!user && (
            <>
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link href={`/profile/${user.userId}`}>Profile</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
