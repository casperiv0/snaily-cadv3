import * as React from "react";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import { getBleetById } from "../../lib/actions/bleeter";
import IBleet from "../../interfaces/Bleet";
import Match from "../../interfaces/Match";
import Loader from "../../components/loader";
import lang from "../../language.json";
import User from "../../interfaces/User";
import AlertMessage from "../../components/alert-message";
import SERVER_URL from "../../config";

interface Props {
  bleet: IBleet;
  loading: boolean;
  isAuth: boolean;
  match: Match;
  user: User;
  getBleetById: (id: string) => void;
}

const Bleet: React.FC<Props> = ({ loading, bleet, match, user, getBleetById }) => {
  React.useEffect(() => {
    const id = match.params.id;
    getBleetById(id);
  }, [getBleetById, match]);

  React.useEffect(() => {
    if (bleet?.id) {
      document.title = `${bleet?.title} - ${lang.nav.bleeter}`;
    }
  }, [bleet]);

  if (loading) {
    return <Loader />;
  }

  if (bleet !== null && !bleet) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.bleeter?.not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout classes="mt-5 pb-5">
      <a className="btn btn-secondary mb-3" href="/bleeter">
        {lang.bleeter.go_back}
      </a>

      <div className="d-flex justify-content-between border-bottom">
        <h3>{bleet.title}</h3>
        <div>
          {bleet.id && user.id === bleet.user_id ? (
            <a className="btn btn-success" type="button" href={`/bleet/edit/${bleet.id}`}>
              Edit bleet
            </a>
          ) : null}
        </div>
      </div>

      {bleet.image_id !== "" ? (
        <img
          style={{ width: "100%", height: "100%" }}
          className="mt-3"
          src={`${SERVER_URL}/static/bleeter-images/${bleet.image_id}`}
          alt="bleet-image"
        />
      ) : null}

      <Markdown className="mt-3" escapeHtml={false} source={bleet.markdown} />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  bleet: state.bleets.bleet,
  user: state.auth.user,
});

export default connect(mapToProps, { getBleetById })(Bleet);
