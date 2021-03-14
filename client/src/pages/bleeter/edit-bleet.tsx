import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import Bleet from "../../interfaces/Bleet";
import Match from "../../interfaces/Match";
import Loader from "../../components/loader";
import lang from "../../language.json";
import User from "../../interfaces/User";
import { getBleetById, updateBleet } from "../../lib/actions/bleeter";
import AlertMessage from "../../components/alert-message";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  match: Match;
  bleet: Bleet | null;
  user: User | null;
  loading: boolean;
  getBleetById: (id: string) => void;
  updateBleet: (data: object, id: string) => Promise<boolean | string>;
}

const EditBleet: React.FC<Props> = ({ bleet, match, loading, user, getBleetById, updateBleet }) => {
  const id = match.params.id;
  const history = useHistory();
  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  useDocTitle("Edit bleet");

  React.useEffect(() => {
    getBleetById(id);
  }, [getBleetById, id]);

  React.useEffect(() => {
    if (bleet?.id) {
      if (bleet.user_id !== user?.id) {
        history.push(`/bleet/${id}`);
      }
    }
  }, [bleet, user, id, history]);

  React.useEffect(() => {
    if (bleet?.id) {
      setTitle(bleet.title);
      setBody(bleet.body);
      document.title = `Editing ${bleet && bleet.title} - ${lang.nav.bleeter}`;
    }
  }, [bleet]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updated = await updateBleet(
      {
        title,
        body,
      },
      id,
    );

    if (typeof updated === "string") {
      history.push(updated);
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (!loading && !bleet?.id) {
    return <AlertMessage message={{ msg: "Bleet was not found", type: "danger" }} />;
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {lang.bleeter.bleet_title}
          </label>
          <input
            type="text"
            id="title"
            className="form-control bg-dark text-light border-dark"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="body">
            {lang.bleeter.bleet_body}
          </label>
          <textarea
            id="body"
            className="form-control bg-dark text-light border-dark"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            style={{ resize: "vertical" }}
          ></textarea>
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to={`/bleet/${bleet?.id}`}>
            {lang.global.cancel}
          </Link>
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
});

export default connect(mapToProps, { getBleetById, updateBleet })(EditBleet);
