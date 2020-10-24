import * as React from "react";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Value from "../../../interfaces/Value";
import Citizen from "../../../interfaces/Citizen";
import { connect } from "react-redux";
import { getLegalStatuses, getVehicles } from "../../../lib/actions/values";
import { getCitizens, registerVehicle } from "../../../lib/actions/citizen";
import AlertMessage from "../../../components/alert-message";

interface Props {
  error: string;
  owners: Citizen[];
  vehicles: Value[];
  legalStatuses: Value[];
  getLegalStatuses: () => void;
  getVehicles: () => void;
  getCitizens: () => void;
  registerVehicle: (data: object) => void;
}

const RegisterVehiclePage: React.FC<Props> = ({
  error,
  owners,
  vehicles,
  legalStatuses,
  getLegalStatuses,
  getVehicles,
  getCitizens,
  registerVehicle,
}) => {
  const [plate, setPlate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [color, setColor] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [citizenId, setCitizenId] = React.useState("");

  React.useEffect(() => {
    getLegalStatuses();
    getVehicles();
    getCitizens();
  }, [getVehicles, getLegalStatuses, getCitizens]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    registerVehicle({
      plate,
      status,
      color,
      vehicle,
      citizenId,
    });
  }

  return (
    <Layout classes="mt-5">
      {error ? <AlertMessage type="warning" message={error} /> : null}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="plate">{lang.citizen.vehicle.enter_plate}</label>
          <input
            type="text"
            id="plate"
            value={plate.toUpperCase()}
            onChange={(e) => setPlate(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            maxLength={8}
            minLength={1}
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">{lang.citizen.vehicle.enter_color}</label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicle">{lang.citizen.vehicle.enter_vehicle}</label>
          <input
            type="text"
            id="vehicle"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            list="vehicles"
          />
          <datalist id="vehicles">
            {vehicles
              .sort((a, b) => Number(a?.default_car) - Number(b?.default_car))
              .map((vehicle: Value, idx: number) => {
                return (
                  <option key={idx} id={`${idx}`}>
                    {vehicle.name}
                  </option>
                );
              })}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="owner">{lang.citizen.vehicle.select_owner}</label>
          <select
            id="owner"
            value={citizenId}
            onChange={(e) => setCitizenId(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value="">{lang.global?.select}</option>
            <option value="" disabled>
              --------
            </option>
            {owners.map((owner: Citizen, idx: number) => {
              return (
                <option value={owner.id} key={idx} id={`${idx}`}>
                  {owner.full_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">{lang.citizen.vehicle.select_status}</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value="">{lang.global?.select}</option>
            <option value="" disabled>
              --------
            </option>
            {legalStatuses.map((status: Value, idx: number) => {
              return (
                <option key={idx} id={`${idx}`}>
                  {status.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group float-right">
          <a href="/citizen" className="btn btn-danger">
            {lang.global.cancel}
          </a>
          <button type="submit" className="ml-2 btn btn-primary">
            {lang.citizen.vehicle.reg_vehicle}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  error: state.citizen.error,
  owners: state.citizen.citizens,
  vehicles: state.values.vehicles,
  legalStatuses: state.values.legalStatuses,
});

export default connect(mapToProps, {
  getLegalStatuses,
  getVehicles,
  getCitizens,
  registerVehicle,
})(RegisterVehiclePage);
