import * as React from "react";
import Modal from "../index";
import lang from "../../../language.json";
import { deleteCitizen } from "../../../lib/actions/admin";
import { Span } from "../../../pages/citizen/citizen-info";
import { connect } from "react-redux";
import { modal } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";

interface Props {
  name: string | undefined;
  id: string | undefined;
  deleteCitizen: (id: string) => void;
}

const DeleteCitizenModal: React.FC<Props> = ({ id, name, deleteCitizen }) => {
  function handleDelete() {
    if (!id) return;

    modal(ModalIds.DeleteCitizen).hide();
    deleteCitizen(id);
  }

  return (
    <Modal title={lang.citizen.delete_citizen} id={ModalIds.DeleteCitizen}>
      <div className="modal-body">
        {lang.citizen.delete_citizen_msg} <Span>{name}</Span>?
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          {lang.global.cancel}
        </button>
        <button type="button" onClick={handleDelete} className="btn btn-danger">
          {lang.citizen.confirm_delete}
        </button>
      </div>
    </Modal>
  );
};

export default connect(null, { deleteCitizen })(DeleteCitizenModal);
