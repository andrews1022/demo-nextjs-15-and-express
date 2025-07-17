const SignUpForm = () => {
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
        <label htmlFor="name" style={{ display: "block" }}>
          Name
        </label>
        <input type="text" id="name" name="name" required />
      </div>

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

      <div>
        <label htmlFor="confirmPassword" style={{ display: "block" }}>
          Confirm Password
        </label>
        <input type="password" id="confirmPassword" name="confirmPassword" required />
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
