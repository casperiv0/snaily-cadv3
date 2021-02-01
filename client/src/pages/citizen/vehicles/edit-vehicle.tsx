import * as React from "react";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Vehicle from "../../../interfaces/Vehicle";
import lang from "../../../language.json";
import Value from "../../../interfaces/Value";
import Match from "../../../interfaces/Match";
import { connect } from "react-redux";
import { getLegalStatuses } from "../../../lib/actions/values";
import { getVehicleById, updateVehicleById } from "../../../lib/actions/citizen";
import Message from "../../../interfaces/Message";
import { Link } from "react-router-dom";

interface Props {
  message: Message;
  vehicle: Vehicle;
  legalStatuses: Value[];
  match: Match;
  getLegalStatuses: () => void;
  getVehicleById: (id: string) => void;
  updateVehicleById: (id: string, citizenId: string, data: object) => void;
}

const EditVehiclePage: React.FC<Props> = ({
  message,
  vehicle,
  legalStatuses,
  match,
  getLegalStatuses,
  getVehicleById,
  updateVehicleById,
}) => {
  const vehicleId = match.params.id;
  const [notFound, setNotFound] = React.useState<boolean>(false);
  const [plate, setPlate] = React.useState("");
  const [color, setColor] = React.useState("");
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    getLegalStatuses();
    getVehicleById(vehicleId);
  }, [getLegalStatuses, getVehicleById, vehicleId]);

  React.useEffect(() => {
    if (vehicle !== null) {
      setPlate(vehicle?.plate || "");
      setColor(vehicle?.color || "");
      setStatus(vehicle?.in_status || "");
      return;
    }

    if (vehicle !== null && !vehicle) {
      setNotFound(true);
    }
  }, [vehicle]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateVehicleById(vehicleId, vehicle?.citizen_id, {
      color,
      status,
    });
  }

  if (notFound) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.citizen.vehicle.not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <AlertMessage message={message} dismissible />

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="plate">
            {lang.citizen.vehicle.enter_plate}
          </label>
          <input
            type="text"
            id="plate"
            disabled
            className="form-control bg-dark border-dark text-light"
            defaultValue={plate}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="color">
            {lang.citizen.vehicle.enter_color}
          </label>
          <input
            type="text"
            id="color"
            className="form-control bg-dark border-dark text-light"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="plate">
            {lang.citizen.vehicle.select_status}
          </label>
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            id="plate"
            className="form-control bg-dark border-dark text-light"
          >
            <option value={vehicle?.in_status}>{vehicle?.in_status}</option>
            <option value="" disabled>
              --------
            </option>
            {legalStatuses.map((item: Value, idx: number) => {
              return (
                <option key={idx} value={item.name}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to={`/citizen/${vehicle?.citizen_id}`}>
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary" type="submit">
            {lang.global.update}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
  vehicle: state.citizen.vehicle,
  legalStatuses: state.values["legal-statuses"],
});

export default connect(mapToProps, {
  getLegalStatuses,
  getVehicleById,
  updateVehicleById,
})(EditVehiclePage);
