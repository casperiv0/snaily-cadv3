import * as React from "react";
import Layout from "../../components/Layout";
import { createTruckLog } from "../../lib/actions/truck-logs";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  createTruckLog: (date: object) => Promise<boolean>;
}

const CreateTruckLogPage: React.FC<Props> = ({ createTruckLog }) => {
  useDocTitle(window.lang.truck_logs.create_log);
  const [name, setName] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [coDriver, setCoDriver] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [plate, setPlate] = React.useState<string>("");
  const history = useHistory();

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
      history.push("/truck-logs");
    }
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {window.lang.truck_logs.enter_trucker_name}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control text-light bg-dark border-dark"
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
            className="form-control text-light bg-dark border-dark"
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
            className="form-control text-light bg-dark border-dark"
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
            className="form-control text-light bg-dark border-dark"
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
            className="form-control text-light bg-dark border-dark"
          />
        </div>
        <div className="mb-3 float-end">
          <Link to="/truck-logs" className="btn btn-danger">
            {window.lang.global.cancel}
          </Link>
          <button className="btn btn-primary ms-2" type="submit">
            {window.lang.truck_logs.create_truck_log}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default connect(null, { createTruckLog })(CreateTruckLogPage);
