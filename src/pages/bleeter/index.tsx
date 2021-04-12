import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "@components/Layout";
import { Bleet } from "types/Bleet";
import { State } from "types/State";
import { getBleets } from "@actions/bleeter/BleeterActions";
import { BleetItem } from "@components/bleeter/BleetItem";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { CreateBleetModal } from "@components/modals/bleeter/CreateBleetModal";
import { ModalIds } from "types/ModalIds";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import lang from "src/language.json";
import { Seo } from "@components/Seo";

interface Props {
  bleets: Bleet[];
}

const BleetPage: React.FC<Props> = ({ bleets }) => {
  return (
    <Layout>
      <Seo title={lang.nav.bleeter} />

      <div className="pb-3 d-flex justify-content-between">
        <h3>{lang.nav.bleeter}</h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateBleet}`}
        >
          {lang.bleeter.create_bleet}
        </button>
      </div>

      {!bleets[0] ? (
        <AlertMessage message={{ msg: lang.bleeter.no_bleet, type: "warning" }} />
      ) : (
        bleets &&
        bleets.map((bleet: Bleet, idx: number) => {
          return <BleetItem key={idx} bleet={bleet} idx={idx} />;
        })
      )}

      <CreateBleetModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getBleets(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  bleets: state.bleeter.bleets,
});

export default connect(mapToProps)(BleetPage);
