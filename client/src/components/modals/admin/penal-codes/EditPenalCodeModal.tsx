import * as React from "react";
import { connect } from "react-redux";
import { updatePenalCode } from "../../../../lib/actions/admin";
import PenalCode from "../../../../interfaces/PenalCode";
import Modal from "../..";
import { ModalIds } from "../../../../lib/types";
import { modal } from "../../../../lib/functions";
import { useModalOpen } from "../../../../hooks/useModalOpen";

interface Props {
  updatePenalCode: (id: string, data: Partial<PenalCode>) => Promise<boolean>;
  code: PenalCode | null;
}

const EditPenalCode: React.FC<Props> = ({ updatePenalCode, code }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditPenalCode);

  React.useEffect(() => {
    if (!code) return;

    setTitle(code?.title);
    setDes(code?.des);
  }, [code]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    const updated = await updatePenalCode(code?.id, {
      title,
      des,
    });

    if (updated === true) {
      modal(ModalIds.EditPenalCode).hide();
    }
  }

  return (
    <Modal size="lg" title={window.lang.codes.edit_penal_code} id={ModalIds.EditPenalCode}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {window.lang.global.title}
            </label>
            <input
              ref={ref}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {window.lang.global.description}
            </label>
            <textarea
              rows={10}
              id="des"
              value={des}
              onChange={(e) => setDes(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {window.lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { updatePenalCode })(EditPenalCode);
