import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div>
      <h1>NotFoundPage</h1>

      <p>Oops! You&apos;re somewhere you&apos;re not supposed to be.</p>

      <p>
        Go <Link href="/">home</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
