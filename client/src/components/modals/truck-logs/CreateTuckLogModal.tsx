import * as React from "react";
import { connect } from "react-redux";
import { createTruckLog } from "../../../lib/actions/truck-logs";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";

interface Props {
  createTruckLog: (date: object) => Promise<boolean>;
}

const CreateTruckLogModal: React.FC<Props> = ({ createTruckLog }) => {
  const [name, setName] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [coDriver, setCoDriver] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [plate, setPlate] = React.useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createTruckLog({
      name,
      date,
      co_driver: coDriver,
      start_time: startTime,
      plate,
    });

    if (created === true) {
      modal(ModalIds.CreateTruckLog).hide();

      setName("");
      setDate("");
      setCoDriver("");
      setStartTime("");
      setPlate("");
    }
  }

  return (
    <Modal size="lg" title={window.lang.truck_logs.create_log} id={ModalIds.CreateTruckLog}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {window.lang.truck_logs.enter_trucker_name}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="co_driver">
              {window.lang.truck_logs.enter_co_driver}
            </label>
            <input
              type="text"
              id="co_driver"
              value={coDriver}
              onChange={(e) => setCoDriver(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="date">
              {window.lang.truck_logs.date}
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="start_time">
              {window.lang.truck_logs.enter_starting_time}
            </label>
            <input
              type="text"
              id="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {window.lang.truck_logs.enter_vehicle_plate}
            </label>
            <input
              type="text"
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="form-control text-light bg-secondary border-secondary"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {window.lang.truck_logs.create_truck_log}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { createTruckLog })(CreateTruckLogModal);
