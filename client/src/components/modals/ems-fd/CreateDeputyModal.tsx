import * as React from "react";
import lang from "../../../language.json";
import { createEmsFdDeputy } from "../../../lib/actions/ems-fd";
import { connect } from "react-redux";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";
import { useModalOpen } from "../../../hooks/useModalOpen";

interface Props {
  createEmsFdDeputy: (data: object) => Promise<boolean | undefined>;
}

const CreateDeputyModal: React.FC<Props> = ({ createEmsFdDeputy }) => {
  const [name, setName] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.CreateEmsFd);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createEmsFdDeputy({
      name,
    });

    if (created) {
      setName("");
      modal(ModalIds.CreateEmsFd).hide();
    }
  }

  return (
    <Modal title={lang.ems_fd.create_a_dept} id={ModalIds.CreateEmsFd}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {lang.ems_fd.enter_name}
            </label>
            <input
              ref={ref}
              type="text"
              value={name}
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.cancel}
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.ems_fd.create_ems}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { createEmsFdDeputy })(CreateDeputyModal);
