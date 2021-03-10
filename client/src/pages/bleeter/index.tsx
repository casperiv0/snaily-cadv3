import * as React from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import Bleet from "../../interfaces/Bleet";
import State from "../../interfaces/State";
import { getBleetPosts } from "../../lib/actions/bleeter";
import lang from "../../language.json";
import BleetItem from "../../components/bleeter/bleetItem";
import Loader from "../../components/loader";
import AlertMessage from "../../components/alert-message";
import { Link } from "react-router-dom";
import useDocTitle from "../../hooks/useDocTitle";

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
    <Layout classes="mt-5">
      <div className="pb-3 d-flex justify-content-between">
        <h3>{lang.nav.bleeter}</h3>
        <Link className="btn btn-primary" to="/bleeter/create">
          Create bleet
        </Link>
      </div>

      {!bleets[0] ? (
        <AlertMessage message={{ msg: lang.bleeter.no_bleet, type: "warning" }} />
      ) : (
        bleets &&
        bleets.map((bleet: Bleet, idx: number) => {
          return <BleetItem key={idx} bleet={bleet} idx={idx} />;
        })
      )}
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  loading: state.bleets.loading,
  bleets: state.bleets.bleets,
});

export default connect(mapToProps, { getBleetPosts })(BleetPage);
