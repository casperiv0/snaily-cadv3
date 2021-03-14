import * as React from "react";
import lang from "../../../language.json";
import Modal, { XButton } from "../index";
import { connect } from "react-redux";
import { updatePassword } from "../../../lib/actions/auth";

interface Props {
  updatePassword: (data: object) => void;
}

const EditPasswordModal: React.FC<Props> = ({ updatePassword }) => {
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [newPassword2, setNewPassword2] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updatePassword({
      oldPassword,
      newPassword,
      newPassword2,
    });
  }

  return (
    <Modal id="editPasswordModal">
      <div className="modal-header">
        <h5>{lang.auth.account.edit_password}</h5>
        <XButton />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="old_password">
              {lang.auth.enter_old_password}
            </label>
            <input
              id="old_password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="new_password">
              {lang.auth.enter_password}
            </label>
            <input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="confirm_password">
              {lang.auth.confirm_password}
            </label>
            <input
              id="confirm_password"
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
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

export default connect(null, { updatePassword })(EditPasswordModal);
