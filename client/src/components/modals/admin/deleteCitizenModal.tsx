import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import { deleteCitizen } from "../../../lib/actions/admin";
import { Span } from "../../../pages/citizen/citizen-info";
import { connect } from "react-redux";

interface Props {
  name: string;
  id: string;
  deleteCitizen: (id: string) => void;
}

const DeleteCitizenModal: React.FC<Props> = ({ id, name, deleteCitizen }) => {
  const btnRef = React.createRef<HTMLButtonElement>();

  function handleDelete() {
    btnRef.current?.click();
    deleteCitizen(id);
  }

  return (
    <Modal id={`deleteCitizenModal${id}`}>
      <div className="modal-header">
        <h5 className="modal-title">{lang.citizen.delete_citizen}?</h5>
        <XButton ref={btnRef} />
      </div>

      <div className="modal-body">
        {lang.citizen.delete_citizen_msg} <Span>{name}</Span>?
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">
          {lang.global.close}
        </button>
        <button type="button" onClick={handleDelete} className="btn btn-danger">
          {lang.citizen.confirm_delete}
        </button>
      </div>
    </Modal>
  );
};

export default connect(null, { deleteCitizen })(DeleteCitizenModal);
