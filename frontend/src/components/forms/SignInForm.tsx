const SignInForm = () => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        margin: "20px 0",
      }}
    >
      <div>
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block" }}>
          Password
        </label>
        <input type="password" id="password" name="password" required />
      </div>

      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignInForm;
