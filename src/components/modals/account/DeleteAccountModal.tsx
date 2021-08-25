import * as React from "react";
import lang from "../../../language.json";
import { Modal } from "components/Modal/Modal";
import { connect } from "react-redux";
import { deleteAccount } from "actions/auth/AuthActions";
import { ModalIds } from "types/ModalIds";

interface Props {
  deleteAccount: () => void;
}

const DeleteAccountModalC: React.FC<Props> = ({ deleteAccount }) => {
  function handleDelete() {
    deleteAccount();
  }

  return (
    <Modal title={lang.auth.account.delete_acc} id={ModalIds.DeleteAccount}>
      <div className="modal-body">{lang.auth.account.delete_acc_confirm}</div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          {lang.global.cancel}
        </button>
        <button type="button" onClick={handleDelete} className="btn btn-danger">
          {lang.auth.account.confirm_delete_acc}
        </button>
      </div>
    </Modal>
  );
};

export const DeleteAccountModal = connect(null, { deleteAccount })(DeleteAccountModalC);
