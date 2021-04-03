import * as React from "react";
import { addValue } from "../../../../lib/actions/values";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Modal from "../..";
import { ModalIds } from "../../../../lib/types";
import { modal } from "../../../../lib/functions";
import { useModalOpen } from "../../../../hooks/useModalOpen";

interface Props {
  addValue: (path: string, data: { name: string }) => Promise<boolean>;
}

const AddValueModal: React.FC<Props> = ({ addValue }) => {
  const { path } = useParams<{ path: string }>();
  const [value, setValue] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.AddValue);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const added = await addValue(path, {
      name: value,
    });

    if (added === true) {
      setValue("");
      modal(ModalIds.AddValue).hide();
    }
  }

  return (
    <Modal id={ModalIds.AddValue} title={window.lang.admin.values[path].add}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {window.lang.admin.values[path].name}
            </label>
            <input
              ref={ref}
              id="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              placeholder={`${window.lang.admin.values[path].name}..`}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            {window.lang.admin.values[path].add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { addValue })(AddValueModal);
