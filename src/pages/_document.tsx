import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class SnailyCAD extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />
          <meta property="og:image" content="/favicon.png" />
          <link rel="preconnect" href="https://code.jquery.com" />
          <link rel="preconnect" href="https://cdn.jsdelivr.net" />
          <link rel="preload" href="https://code.jquery.com" />
          <link rel="preload" href="https://cdn.jsdelivr.net" />
          <link rel="preload" href="/fonts/Assistant-Regular.ttf" as="font" type="font/ttf" />
          <link rel="preload" href="/fonts/Assistant-Medium.ttf" as="font" type="font/ttf" />
          <link rel="preload" href="/fonts/Assistant-Bold.ttf" as="font" type="font/ttf" />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />

          <div id="page-loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </body>
      </Html>
    );
  }
}

export default SnailyCAD;
