import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container-404">
      <div>
        <h1>404</h1>
        <p>Whoops! That page could not be found</p>

        <Link href="/">
          <a className="btn btn-dark p-2 px-4 fs-5 mt-2">Return Home</a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
