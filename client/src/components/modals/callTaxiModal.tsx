import * as React from "react";
import Modal, { XButton } from "./index";
import lang from "../../language.json";
import { createTaxiCall } from "../../lib/actions/taxi-calls";
import { connect } from "react-redux";

interface Props {
  createTaxiCall: (data: object) => void;
}

const CallTaxiModal: React.FC<Props> = ({ createTaxiCall }) => {
  const [description, setDescription] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createTaxiCall({
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
    <Modal id="callTaxiModal">
      <div className="modal-header">
        <h5 className="modal-title">Call Taxi Service</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="taxi_desc">
              {lang.global.description}
            </label>
            <textarea
              cols={30}
              rows={5}
              value={description}
              id="taxi_desc"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="taxi_caller">
              {lang.global.caller}
            </label>
            <input
              type="text"
              value={caller}
              id="taxi_caller"
              onChange={(e) => setCaller(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="taxi_location">
              {lang.global.location}
            </label>
            <input
              type="text"
              value={location}
              id="taxi_location"
              onChange={(e) => setLocation(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
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

export default connect(null, { createTaxiCall })(CallTaxiModal);
