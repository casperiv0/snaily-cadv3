import * as React from "react";
import lang from "src/language.json";
import { createEmsFdDeputy } from "@actions/ems-fd/EmsFdActions";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal, RequestData } from "@lib/utils";
import { useModalOpen } from "@hooks/useModalOpen";

interface Props {
  createEmsFdDeputy: (data: RequestData) => Promise<boolean>;
}

const CreateDeputyModalC: React.FC<Props> = ({ createEmsFdDeputy }) => {
  const [name, setName] = React.useState<string>("");
  const [callsign, setCallSign] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.CreateEmsFd);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createEmsFdDeputy({
      name,
      callsign: callsign,
    });

    if (created) {
      setCallSign("");
      setName("");
      modal(ModalIds.CreateEmsFd)?.hide();
    }

    setLoading(false);
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

          <div className="mb-3">
            <label className="form-label" htmlFor="callSign">
              {lang.officers.callsign}
            </label>
            <input
              ref={ref}
              type="text"
              value={callsign}
              id="callSign"
              onChange={(e) => setCallSign(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} className="btn btn-primary ms-2" type="submit">
            {loading ? `${lang.global.loading}..` : lang.ems_fd.create_ems}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateDeputyModal = connect(null, { createEmsFdDeputy })(CreateDeputyModalC);
