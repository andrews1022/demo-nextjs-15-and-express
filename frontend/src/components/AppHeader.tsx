import Link from "next/link";

const AppHeader = () => {
  return (
    <header>
      <nav>
        <ul style={{ display: "flex", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* when not signed in */}
          <li>
            <Link href="/sign-in">Sign In</Link>
          </li>

          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li>

          {/* when signed in */}
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
