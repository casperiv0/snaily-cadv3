import * as React from "react";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Vehicle from "../../../interfaces/Vehicle";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { getLegalStatuses } from "../../../lib/actions/values";
import Value from "../../../interfaces/Value";

interface Props {
  error: string;
  vehicle: Vehicle;
  legalStatuses: Value[];
  getLegalStatuses: () => void;
}

const EditVehiclePage: React.FC<Props> = ({
  error,
  vehicle,
  legalStatuses,
  getLegalStatuses,
}) => {
  const [plate, setPlate] = React.useState("QSDD");
  const [color, setColor] = React.useState("");
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    getLegalStatuses();
  }, [getLegalStatuses]);

  React.useEffect(() => {
    if (vehicle !== null) {
      setPlate(vehicle?.plate);
      setColor(vehicle?.color);
      setStatus(vehicle?.in_status);
    }
  }, [vehicle]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <Layout>
      {error ? <AlertMessage type="warning" message={error} /> : null}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="plate">{lang.citizen.vehicle.enter_plate}</label>
          <input
            type="text"
            id="plate"
            disabled
            className="form-control bg-dark border-dark text-light"
            defaultValue={plate}
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">{lang.citizen.vehicle.enter_color}</label>
          <input
            type="text"
            id="color"
            className="form-control bg-dark border-dark text-light"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="plate">{lang.citizen.vehicle.select_status}</label>
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
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  error: state.citizen.error,
  vehicle: state.citizen.vehicle,
  legalStatuses: state.values.legalStatuses,
});

export default connect(mapToProps, { getLegalStatuses })(EditVehiclePage);
