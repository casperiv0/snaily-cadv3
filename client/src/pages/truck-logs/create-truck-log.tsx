import * as React from "react";
import AlertMessage from "../../components/alert-message";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { createTruckLog } from "../../lib/actions/truck-logs";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import { Link } from "react-router-dom";

interface Props {
  message: Message;
  createTruckLog: (date: object) => void;
}

const CreateTruckLogPage: React.FC<Props> = ({ message, createTruckLog }) => {
  const [name, setName] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [coDriver, setCoDriver] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [plate, setPlate] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createTruckLog({
      name,
      date,
      co_driver: coDriver,
      start_time: startTime,
      plate,
    });
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <AlertMessage message={message} dismissible />
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {lang.truck_logs.enter_trucker_name}
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
            {lang.truck_logs.enter_co_driver}
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
            {lang.truck_logs.date}
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
            {lang.truck_logs.enter_starting_time}
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
            {lang.truck_logs.enter_vehicle_plate}
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
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.truck_logs.create_truck_log}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
});

export default connect(mapToProps, { createTruckLog })(CreateTruckLogPage);
