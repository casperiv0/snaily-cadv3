import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import { connect } from "react-redux";
import { getBleetById } from "../../lib/actions/bleeter";
import IBleet from "../../interfaces/Bleet";
import Match from "../../interfaces/Match";
import Loader from "../../components/loader";
import lang from "../../language.json";
import Markdown from "react-markdown";

interface Props {
  bleet: IBleet;
  loading: boolean;
  isAuth: boolean;
  match: Match;
  getBleetById: (id: string) => void;
}

const Bleet: React.FC<Props> = ({
  loading,
  bleet,
  isAuth,
  match,
  getBleetById,
}) => {
  React.useEffect(() => {
    const id = match.params.id;
    getBleetById(id);
  }, [getBleetById, match]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout classes="mt-5 pb-5">
      <a className="btn btn-secondary mb-3" href="/bleeter">
        {lang.bleeter.go_back}
      </a>

      <div className="d-flex justify-content-between border-bottom">
        <h3>{bleet.title}</h3>
        <div>
          {isAuth ? (
            <a
              className="btn btn-success"
              type="button"
              href={`/bleeter/edit/${bleet.id}`}
            >
              Edit bleet
            </a>
          ) : null}
        </div>
      </div>

      <Markdown escapeHtml={false} source={bleet.markdown} />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  bleet: state.bleets.bleet,
  isAuth: state.auth.isAuth,
});

export default connect(mapToProps, { getBleetById })(Bleet);
