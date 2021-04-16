import Link from "next/link";
import Head from "next/head";

const Forbidden = () => {
  return (
    <div className="container-404">
      <Head>
        <title>403 - Forbidden</title>
      </Head>

      <div>
        <h1>403</h1>
        <p>Forbidden. You are not allowed to view the requested page</p>

        <Link href="/">
          <a className="btn btn-dark p-2 px-4 fs-5 mt-2">Return Home</a>
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
