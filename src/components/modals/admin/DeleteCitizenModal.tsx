import * as React from "react";
import { Modal } from "components/Modal/Modal";
import lang from "../../../language.json";
import { deleteCitizen } from "actions/admin/AdminActions";
import { connect } from "react-redux";
import { modal } from "lib/utils";
import { ModalIds } from "types/ModalIds";
import { Span } from "components/Item";

interface Props {
  name: string | undefined;
  id: string | undefined;
  deleteCitizen: (id: string) => void;
}

const DeleteCitizenModalC: React.FC<Props> = ({ id, name, deleteCitizen }) => {
  function handleDelete() {
    if (!id) return;

    modal(ModalIds.DeleteCitizen)?.hide();
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

export const DeleteCitizenModal = connect(null, { deleteCitizen })(DeleteCitizenModalC);
