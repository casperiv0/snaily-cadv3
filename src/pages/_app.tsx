import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import Router from "next/router";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import Bootstrap from "bootstrap";
import { useStore } from "src/state/useStore";
import "../styles/global.css";
import "../styles/fonts.css";
import { Navbar } from "src/components/navbar/Navbar";
import { GlobalSearch } from "@components/GlobalSearch/GlobalSearch";

const ToastContainer: any = dynamic(
  () => import("react-toastify").then((m) => m.ToastContainer) as any,
);

declare global {
  interface Window {
    bootstrap: typeof Bootstrap;
  }
}

Router.events.on("routeChangeStart", () =>
  document.getElementById("page-loader")?.classList.add("active"),
);
Router.events.on("routeChangeComplete", () =>
  document.getElementById("page-loader")?.classList.remove("active"),
);
Router.events.on("routeChangeError", () =>
  document.getElementById("page-loader")?.classList.remove("active"),
);

function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps?.initialReduxState ?? pageProps);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ToastContainer
        pauseOnFocusLoss={false}
        hideProgressBar
        limit={5}
        newestOnTop
        autoClose={3000}
        draggablePercent={40}
        closeButton={false}
        toastStyle={{
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
        }}
      />
      <ReduxProvider store={store}>
        <Navbar />
        <GlobalSearch />
        <Component {...pageProps} />
      </ReduxProvider>
    </>
  );
}

export default App;
