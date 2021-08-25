import * as React from "react";
import { connect } from "react-redux";
import ms from "ms";
import { updatePenalCode } from "actions/admin/AdminActions";
import { PenalCode } from "types/PenalCode";
import { Modal } from "components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal, notify } from "lib/utils";
import { useModalOpen } from "hooks/useModalOpen";
import lang from "src/language.json";
import { Nullable } from "types/State";

interface Props {
  updatePenalCode: (id: string, data: Partial<PenalCode>) => Promise<boolean>;
  code: Nullable<PenalCode>;
}

const EditPenalCodeC: React.FC<Props> = ({ updatePenalCode, code }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState<string>("");
  const [fineAmount, setFineAmount] = React.useState("");
  const [jailTime, setJailTime] = React.useState("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditPenalCode);

  React.useEffect(() => {
    if (!code) return;

    setTitle(code?.title);
    setDes(code?.des);
    setJailTime(code.jail_time ?? "");
    setFineAmount(code.fine_amount ?? "");
  }, [code]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    let isValidMs: string | number = "";
    if (jailTime && !Number(jailTime)) {
      isValidMs = ms(jailTime);
      if (!isValidMs) {
        return notify.warn(
          "Invalid jail time! Please use `hours`, `minutes`,  `seconds`, `milliseconds`",
        );
      }
    } else {
      isValidMs = jailTime;
    }

    const updated = await updatePenalCode(code?.id, {
      title,
      des,
      jail_time: typeof isValidMs === "number" ? `${isValidMs / 1000}` : isValidMs,
      fine_amount: fineAmount,
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
            <label className="form-label" htmlFor="edit_penal_code_title">
              {lang.global.title}
            </label>
            <input
              ref={ref}
              id="edit_penal_code_title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="edit_penal_code_add_jail_time">
              {lang.codes.jail_time}
            </label>
            <input
              type="text"
              id="edit_penal_code_add_jail_time"
              value={jailTime}
              onChange={(e) => setJailTime(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="edit_penal_code_fine_amount">
              {lang.codes.fine_amount}
            </label>
            <input
              type="number"
              id="edit_penal_code_fine_amount"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="edit_penal_code_des">
              {lang.global.description}
            </label>
            <textarea
              rows={10}
              id="edit_penal_code_des"
              value={des}
              onChange={(e) => setDes(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
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
