import * as React from "react";
import Modal, { XButton } from "./index";
import lang from "../../language.json";
import { createTowCall } from "../../lib/actions/tow-calls";
import { connect } from "react-redux";

interface Props {
  createTowCall: (data: object) => void;
}

const CallTowModal: React.FC<Props> = ({ createTowCall }) => {
  const [description, setDescription] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createTowCall({
      description,
      location,
      caller,
    });

    btnRef.current?.click();

    setDescription("");
    setLocation("");
    setCaller("");
  }

  return (
    <Modal size="lg" id="callTowModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.calls.tow_service}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="tow_description">
              {lang.global.description}
            </label>
            <textarea
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

export default connect(null, { createTowCall })(CallTowModal);
