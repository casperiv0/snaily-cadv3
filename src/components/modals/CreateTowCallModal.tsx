import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "../../language.json";
import { createCall } from "@actions/calls/CallActions";
import { modal, RequestData } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { CallTypes } from "@actions/calls/CallTypes";
import { useModalOpen } from "@hooks/useModalOpen";

interface Props {
  createCall: (type: CallTypes, data: RequestData) => Promise<boolean>;
}

const CreateTowCallModalC: React.FC<Props> = ({ createCall }) => {
  const [description, setDescription] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const ref = useModalOpen<HTMLTextAreaElement>(ModalIds.CallTow);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await createCall("tow", {
      description,
      location,
      caller,
    });

    if (success === true) {
      modal(ModalIds.CallTow)?.hide();
      setDescription("");
      setLocation("");
      setCaller("");
    }
  }

  return (
    <Modal title={lang.calls.tow_service} size="lg" id={ModalIds.CallTow}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="tow_description">
              {lang.global.description}
            </label>
            <textarea
              ref={ref}
              cols={30}
              rows={5}
              value={description}
              id="tow_description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-6">
              <label className="form-label" htmlFor="tow_caller">
                {lang.global.caller}
              </label>
              <input
                type="text"
                value={caller}
                id="tow_caller"
                onChange={(e) => setCaller(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="tow_location">
                {lang.global.location}
              </label>
              <input
                type="text"
                value={location}
                id="tow_location"
                onChange={(e) => setLocation(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.calls.call}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateTowCallModal = connect(null, { createCall })(CreateTowCallModalC);
