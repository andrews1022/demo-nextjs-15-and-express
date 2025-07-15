const SignUpForm = () => {
  return (
    <form style={{ margin: "20px 0" }}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />
      </div>
    </form>
  );
};

export default SignUpForm;
