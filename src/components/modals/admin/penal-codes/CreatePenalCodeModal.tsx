import * as React from "react";
import { connect } from "react-redux";
import ms from "ms";
import { addPenalCode } from "@actions/admin/AdminActions";
import { PenalCode } from "types/PenalCode";
import { modal, notify } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { Modal } from "@components/Modal/Modal";
import { useModalOpen } from "../../../../hooks/useModalOpen";
import lang from "src/language.json";

interface Props {
  addPenalCode: (data: Partial<PenalCode>) => Promise<boolean>;
}

const CreatePenalCodeModalC: React.FC<Props> = ({ addPenalCode }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState("");
  const [jailTime, setJailTime] = React.useState("");
  const [fineAmount, setFineAmount] = React.useState("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.CreatePenalCode);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    let isValidMs: string | number = "";
    if (jailTime) {
      isValidMs = ms(jailTime);
      if (!isValidMs) {
        return notify.warn(
          "Invalid jail time! Please use `hours`, `minutes`,  `seconds`, `milliseconds`",
        );
      }
    }

    const added = await addPenalCode({
      title,
      des,
      jail_time: typeof isValidMs === "number" ? `${isValidMs / 1000}` : "",
      fine_amount: fineAmount,
    });

    if (added === true) {
      setTitle("");
      setDes("");
      setJailTime("");
      setFineAmount("");
      modal(ModalIds.CreatePenalCode)?.hide();
    }
  }

  return (
    <Modal size="lg" title={lang.codes.add_penal_code} id={ModalIds.CreatePenalCode}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="create_penal_code_title">
              {lang.global.title}
            </label>
            <input
              ref={ref}
              id="create_penal_code_title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="create_penal_code_add_jail_time">
              {lang.codes.jail_time}
            </label>
            <input
              id="create_penal_code_add_jail_time"
              value={jailTime}
              onChange={(e) => setJailTime(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="create_penal_code_fine_amount">
              {lang.codes.fine_amount}
            </label>
            <input
              type="number"
              id="create_penal_code_fine_amount"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="create_penal_code_des">
              {lang.global.description}
            </label>
            <textarea
              rows={7}
              id="create_penal_code_des"
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
            {lang.codes.add_code}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreatePenalCodeModal = connect(null, { addPenalCode })(CreatePenalCodeModalC);
