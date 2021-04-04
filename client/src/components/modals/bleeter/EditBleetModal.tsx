import * as React from "react";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import Bleet from "../../../interfaces/Bleet";
import Loader from "../../../components/loader";
import lang from "../../../language.json";
import User from "../../../interfaces/User";
import { updateBleet } from "../../../lib/actions/bleeter";
import AlertMessage from "../../../components/alert-message";
import { ModalIds } from "../../../lib/types";
import Modal from "..";

interface Props {
  bleet: Bleet | null;
  user: User | null;
  loading: boolean;
  updateBleet: (id: string, data: object) => void;
}

const EditBleetModal: React.FC<Props> = ({ bleet, loading, updateBleet }) => {
  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");

  React.useEffect(() => {
    if (bleet?.id) {
      setTitle(bleet.title);
      setBody(bleet.body);
    }
  }, [bleet]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bleet) return;

    updateBleet(bleet?.id, {
      title,
      body,
    });
  }

  if (loading) {
    return <Loader />;
  }

  if (!loading && !bleet?.id) {
    return <AlertMessage message={{ msg: window.lang.bleeter.bleet_not_found, type: "danger" }} />;
  }

  return (
    <Modal size="lg" title="Edit bleet" id={ModalIds.EditBleet}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              {lang.bleeter.bleet_title}
            </label>
            <input
              type="text"
              id="title"
              className="form-control bg-secondary border-secondary text-light"
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
              className="form-control bg-secondary border-secondary text-light"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              style={{ resize: "vertical" }}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.cancel}
          </button>
          <button className="btn btn-success" type="submit">
            {lang.bleeter.update_bleet}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
  loading: state.bleets.loading,
});

export default connect(mapToProps, { updateBleet })(EditBleetModal);
