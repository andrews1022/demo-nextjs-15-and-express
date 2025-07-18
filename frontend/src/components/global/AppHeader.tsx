import Link from "next/link";
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";
// import type { JWTPayload } from "jose";
import LogoutButton from "@/components/LogoutButton";
import { verifySession } from "@/auth/session";

// You must set this to your backend JWT secret
// const JWT_SECRET = process.env.JWT_SECRET;

// const getUserFromCookie = async (): Promise<JWTPayload | null> => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(cookieHelper.name);

//   if (!token || !JWT_SECRET) {
//     return null;
//   }

//   try {
//     const { payload } = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));

//     return payload;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("JWT verification failed:", error.message);
//     }

//     return null;
//   }
// };

const AppHeader = async () => {
  const session = await verifySession();
  // console.log("session: ", session);

  return (
    <header>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <nav>
        <ul style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* <li>
            <Link href="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li> */}

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
                {/* <LogoutButton /> */}
                Log out Button here
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
