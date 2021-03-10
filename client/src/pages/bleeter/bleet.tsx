import * as React from "react";
import Markdown from "react-markdown/with-html";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import { getBleetById, deleteBleet } from "../../lib/actions/bleeter";
import IBleet from "../../interfaces/Bleet";
import Match from "../../interfaces/Match";
import Loader from "../../components/loader";
import lang from "../../language.json";
import User from "../../interfaces/User";
import AlertMessage from "../../components/alert-message";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  bleet: IBleet | null;
  loading: boolean;
  isAuth: boolean;
  match: Match;
  user: User | null;
  getBleetById: (id: string) => void;
  deleteBleet: (id: string) => Promise<boolean | undefined>;
}

const Bleet: React.FC<Props> = ({ loading, bleet, match, user, getBleetById, deleteBleet }) => {
  const id = match.params.id;
  const history = useHistory();
  useDocTitle(`${bleet?.id ? `${bleet.title} - ` : ""} ${lang.nav.bleeter}`);

  React.useEffect(() => {
    getBleetById(id);
  }, [getBleetById, id]);

  async function handleDelete() {
    const deleted = await deleteBleet(id);

    if (deleted) {
      history.push("/bleeter");
    }
  }

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
      <Link className="btn btn-secondary mb-3" to="/bleeter">
        {lang.bleeter.go_back}
      </Link>

      <div className="d-flex justify-content-between border-bottom">
        <div>
          <h3 className="mb-2">{bleet?.title}</h3>
          <p className="mt-1 mb-1">
            <strong>Uploaded By: </strong>
            {bleet?.uploadedBy}
          </p>
        </div>
        <div>
          {bleet?.id && user?.id === bleet?.user_id ? (
            <Link className="btn btn-success mx-2" type="button" to={`/bleet/edit/${bleet.id}`}>
              Edit bleet
            </Link>
          ) : null}
          {(user?.id && ["owner", "admin", "moderator"].includes(user.rank)) ||
          bleet?.user_id === user?.id ? (
            <button onClick={handleDelete} className="btn btn-danger">
              Delete bleet
            </button>
          ) : null}
        </div>
      </div>

      {bleet?.image_id !== "" ? (
        <img
          style={{ width: "100%", height: "100%" }}
          className="mt-3"
          src={`/static/bleeter-images/${bleet?.image_id}`}
          alt="bleet-image"
        />
      ) : null}

      <Markdown allowDangerousHtml className="mt-3">
        {bleet?.markdown ?? ""}
      </Markdown>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  bleet: state.bleets.bleet,
  user: state.auth.user,
});

export default connect(mapToProps, { getBleetById, deleteBleet })(Bleet);
