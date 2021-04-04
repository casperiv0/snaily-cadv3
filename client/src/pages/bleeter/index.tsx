import * as React from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import Bleet from "../../interfaces/Bleet";
import State from "../../interfaces/State";
import { getBleetPosts } from "../../lib/actions/bleeter";
import BleetItem from "../../components/bleeter/bleetItem";
import Loader from "../../components/loader";
import AlertMessage from "../../components/alert-message";
import useDocTitle from "../../hooks/useDocTitle";
import CreateBleetModal from "../../components/modals/bleeter/CreateBleetModal";
import { ModalIds } from "../../lib/types";

interface Props {
  bleets: Bleet[];
  loading: boolean;
  getBleetPosts: any;
}

const BleetPage: React.FC<Props> = ({ bleets, loading, getBleetPosts }) => {
  useDocTitle("Bleeter");

  React.useEffect(() => {
    getBleetPosts();
  }, [getBleetPosts]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="pb-3 d-flex justify-content-between">
        <h3>{window.lang.nav.bleeter}</h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateBleet}`}
        >
          {window.lang.bleeter.create_bleet}
        </button>
      </div>

      {!bleets[0] ? (
        <AlertMessage message={{ msg: window.lang.bleeter.no_bleet, type: "warning" }} />
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

const mapToProps = (state: State) => ({
  loading: state.bleets.loading,
  bleets: state.bleets.bleets,
});

export default connect(mapToProps, { getBleetPosts })(BleetPage);
