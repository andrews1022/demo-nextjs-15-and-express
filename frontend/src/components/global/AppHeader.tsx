import Link from "next/link";

const AppHeader = () => {
  return (
    <header>
      <nav>
        <ul style={{ display: "flex", gap: "1rem" }}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* links to show when not signed in */}
          <li>
            <Link href="/sign-in">Sign In</Link>
          </li>

          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li>

          {/* links and button to show when signed in */}
          {/* <li>
            <Link href={`/profile/${user?.id}`}>Profile</Link>
          </li>
          <li>
            {user && (
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>Hello, {user.name}!</span>
            )}
            <button
              // onClick={handleLogout}
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
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
