import { verifyAuth } from "actions/auth/AuthActions";
import { getCalls } from "actions/calls/CallActions";
import { getActiveUnits } from "actions/dispatch/DispatchActions";
import { getCadInfo } from "actions/global/GlobalActions";
import { initializeStore } from "state/useStore";
import { GetServerSideProps } from "next";
import Head from "next/head";

import dynamic from "next/dynamic";
import { Seo } from "components/Seo";
import { useClientPerms } from "hooks/useClientPerms";
const Map = dynamic(() => import("components/dispatch/map/Map"), {
  ssr: false,
  loading: () => <p>loading map..</p>,
});

const MapPage = () => {
  useClientPerms("dispatch");

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        {/* disabled since I can't use css modules for this & I don't want to load unneeded css via _app.tsx */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/map.css" />
      </Head>

      <Seo title="Dispatch Map" />

      <Map />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCalls("911", req.headers)(store.dispatch);
  await getActiveUnits(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default MapPage;
