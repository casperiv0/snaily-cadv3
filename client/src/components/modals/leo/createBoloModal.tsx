import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import { createBolo } from "../../../lib/actions/bolos";
import { connect } from "react-redux";

interface Props {
  createBolo: (data: object) => void;
}

const CreateBoloModal: React.FC<Props> = ({ createBolo }) => {
  const [type, setType] = React.useState("person");
  const [name, setName] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [color, setColor] = React.useState("");
  const [description, setDescription] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createBolo({
      type,
      name,
      plate,
      color,
      description,
    });

    setType("");
    setName("");
    setPlate("");
    setColor("");
    setDescription("");

    btnRef.current?.click();
  }

  return (
    <Modal size="lg" id="createBoloModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.create_bolo}</h5>
        <XButton ref={btnRef}></XButton>
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="type">
              {lang.citizen.medical.type}
            </label>
            <select
              className="form-control bg-secondary border-secondary text-light"
              id="type"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="person">{lang.global.person}</option>
              <option value="vehicle">{lang.global.vehicle}</option>
              <option value="other">{lang.global.other}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              {lang.global.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="bolo_description"
              rows={5}
              className="form-control bg-secondary border-secondary text-light"
            ></textarea>
          </div>

          {type === "person" ? (
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                {lang.record.enter_per_name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>
          ) : type === "vehicle" ? (
            <>
              <div className="mb-3">
                <label className="form-label" htmlFor="plate">
                  {lang.record.enter_plate}
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="form-control bg-secondary border-secondary text-light"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="color">
                  {lang.record.enter_color}
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="form-control bg-secondary border-secondary text-light"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={description === ""} className="btn btn-primary">
            {lang.global.create_bolo}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { createBolo })(CreateBoloModal);
