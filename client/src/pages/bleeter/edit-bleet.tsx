import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import Bleet from "../../interfaces/Bleet";
import Match from "../../interfaces/Match";
import Loader from "../../components/loader";
import lang from "../../language.json";
import User from "../../interfaces/User";
import { connect } from "react-redux";
import { getBleetById, updateBleet } from "../../lib/actions/bleeter";
import AlertMessage from "../../components/alert-message";
import { useHistory } from "react-router-dom";

interface Props {
  error: string;
  bleet: Bleet;
  match: Match;
  user: User;
  loading: boolean;
  getBleetById: (id: string) => void;
  updateBleet: (data: object, id: string) => void;
}

const EditBleet: React.FC<Props> = ({
  error,
  bleet,
  match,
  loading,
  user,
  getBleetById,
  updateBleet,
}) => {
  const id = match.params.id;
  const history = useHistory();
  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");

  React.useEffect(() => {
    getBleetById(id);
  }, [getBleetById, id]);

  React.useEffect(() => {
    if (bleet.id) {
      if (bleet.user_id !== user.id) {
        history.push(`/bleet/${id}`);
      }
    }
  }, [bleet, user, id, history]);

  React.useEffect(() => {
    if (bleet.id) {
      setTitle(bleet.title);
      setBody(bleet.body);
      document.title = `Editing ${bleet && bleet.title} - ${lang.nav.bleeter}`;
    }
  }, [bleet]);

  if (loading) {
    return <Loader />;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateBleet(
      {
        title,
        body,
      },
      id,
    );
  }

  return (
    <Layout classes="mt-5">
      {error ? <AlertMessage type="warning" message={error} /> : null}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">{lang.bleeter.bleet_title}</label>
          <input
            type="text"
            id="title"
            className="form-control bg-dark text-light border-dark"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">{lang.bleeter.bleet_body}</label>
          <textarea
            id="body"
            className="form-control bg-dark text-light border-dark"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            style={{ resize: "vertical" }}
          ></textarea>
        </div>
        <div className="form-group float-right">
          <a className="btn btn-danger mr-2" href={`/bleet/${bleet.id}`}>
            {lang.global.cancel}
          </a>
          <button className="btn btn-success" type="submit">
            {lang.bleeter.update_bleet}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
  bleet: state.bleets.bleet,
  loading: state.bleets.loading,
  error: state.bleets.error,
});

export default connect(mapToProps, { getBleetById, updateBleet })(EditBleet);
