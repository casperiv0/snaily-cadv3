import * as React from "react";
import lang from "../../../language.json";
import { Modal } from "@components/Modal/Modal";
import { connect } from "react-redux";
import { updateUsername } from "@actions/auth/AuthActions";
import { ModalIds } from "types/ModalIds";
import { useModalOpen } from "../../../hooks/useModalOpen";
import { RequestData } from "@lib/utils";

interface Props {
  updateUsername: (data: RequestData) => void;
}

const EditUsernameModalC: React.FC<Props> = ({ updateUsername }) => {
  const [newUsername, setNewUsername] = React.useState<string>("");
  const [passwordConfirm, setConfirmPassword] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditUsername);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateUsername({
      newUsername,
      passwordConfirm,
    });
  }

  return (
    <Modal title={lang.auth.edit_username} id={ModalIds.EditUsername}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="new-password">
              {lang.auth.new_username}
            </label>
            <input
              ref={ref}
              id="new-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="new-password">
              {lang.auth.enter_password}
            </label>
            <input
              id="new-password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.auth.update_password}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditUsernameModal = connect(null, { updateUsername })(EditUsernameModalC);
