import Link from "next/link";
import Head from "next/head";

const NotFound = () => {
  return (
    <div className="container-404">
      <Head>
        <title>404 - Page was not found</title>
      </Head>

      <div>
        <h1>404</h1>
        <p>Whoops! That page could not be found</p>

        <Link href="/citizen">
          <a className="btn btn-dark p-2 px-4 fs-5 mt-2">Return Home</a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
