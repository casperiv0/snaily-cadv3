import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import { Bleet } from "types/Bleet";
import lang from "src/language.json";
import { User } from "types/User";
import { updateBleet } from "@actions/bleeter/BleeterActions";
import { ModalIds } from "types/ModalIds";
import { Modal } from "@components/Modal/Modal";
import { modal, RequestData } from "@lib/utils";

interface Props {
  bleet: Nullable<Bleet>;
  user: Nullable<User>;
  updateBleet: (id: string, data: RequestData) => Promise<boolean>;
}

const EditBleetModalC: React.FC<Props> = ({ bleet, updateBleet }) => {
  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (bleet?.id) {
      setTitle(bleet.title);
      setBody(bleet.body);
    }
  }, [bleet]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bleet) return;
    setLoading(true);

    const success = await updateBleet(bleet?.id, {
      title,
      body,
    });

    if (success) {
      modal(ModalIds.EditBleet)?.hide();
    }

    setLoading(false);
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
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} className="btn btn-success" type="submit">
            {loading ? `${lang.global.loading}..` : lang.bleeter.update_bleet}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export const EditBleetModal = connect(mapToProps, { updateBleet })(EditBleetModalC);
