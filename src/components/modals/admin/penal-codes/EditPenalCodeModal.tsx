import * as React from "react";
import { connect } from "react-redux";
import { updatePenalCode } from "@actions/admin/AdminActions";
import { PenalCode } from "types/PenalCode";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { useModalOpen } from "@hooks/useModalOpen";
import lang from "src/language.json";

interface Props {
  updatePenalCode: (id: string, data: Partial<PenalCode>) => Promise<boolean>;
  code: PenalCode | null;
}

const EditPenalCodeC: React.FC<Props> = ({ updatePenalCode, code }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditPenalCode);
  const [jailTime, setJailTime] = React.useState("");

  React.useEffect(() => {
    if (!code) return;

    setTitle(code?.title);
    setDes(code?.des);
    setJailTime(code.jail_time ?? "");
  }, [code]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    const updated = await updatePenalCode(code?.id, {
      title,
      des,
      jail_time: jailTime,
    });

    if (updated === true) {
      modal(ModalIds.EditPenalCode)?.hide();
    }
  }

  return (
    <Modal size="lg" title={lang.codes.edit_penal_code} id={ModalIds.EditPenalCode}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {lang.global.title}
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
              {lang.codes.jail_time}
            </label>
            <input
              type="number"
              id="add_jail_time"
              value={jailTime}
              onChange={(e) => setJailTime(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {lang.global.description}
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
            {lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditPenalCodeModal = connect(null, { updatePenalCode })(EditPenalCodeC);
