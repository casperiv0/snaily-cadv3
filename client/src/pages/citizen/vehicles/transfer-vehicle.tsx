import * as React from "react";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Vehicle from "../../../interfaces/Vehicle";
import Match from "../../../interfaces/Match";
import AlertMessage from "../../../components/alert-message";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { getAllCitizens, getVehicleById, transferVehicle } from "../../../lib/actions/citizen";
import Citizen from "../../../interfaces/Citizen";
import { Link } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";
import Select from "../../../components/select";

interface Props {
  vehicle: Vehicle | null;
  match: Match;
  owners: Citizen[];
  getVehicleById: (id: string) => void;
  getAllCitizens: () => void;
  transferVehicle: (id: string, data: object) => void;
}

const TransferVehiclePage: React.FC<Props> = ({
  match,
  vehicle,
  owners,
  getVehicleById,
  getAllCitizens,
  transferVehicle,
}) => {
  const [notFound, setNotFound] = React.useState<boolean>(false);
  const [plate, setPlate] = React.useState<string>("");
  const [ownerId, setOwnerId] = React.useState<string>("");
  const vehicleId = match.params.id;
  useDocTitle("Transfer vehicle");

  React.useEffect(() => {
    getVehicleById(vehicleId);
    getAllCitizens();
  }, [getVehicleById, getAllCitizens, vehicleId]);

  React.useEffect(() => {
    if (vehicle !== null) {
      setPlate(vehicle?.plate);
    }

    if (vehicle !== null && !vehicle) {
      setNotFound(true);
    }
  }, [vehicle]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    transferVehicle(vehicleId, { plate, ownerId });
  }

  if (notFound) {
    return (
      <Layout>
        <AlertMessage message={{ msg: "Not found", type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="plate">
            {lang.global.plate}
          </label>
          <input
            type="text"
            className="form-control bg-dark border-dark text-light"
            id="plate"
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            value={plate?.toUpperCase()}
            maxLength={8}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="owner">
            {lang.citizen.vehicle.transfer_to}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setOwnerId(v.value)}
            options={owners
              .filter((cit) => cit.id !== vehicle?.citizen_id)
              .map((owner: Citizen) => ({
                value: owner.id,
                label: owner.full_name,
              }))}
          />
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to={`/citizen/${vehicle?.citizen_id}`}>
            {lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {lang.citizen.vehicle.transfer_veh}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  owners: state.citizen.citizens,
  vehicle: state.citizen.vehicle,
});

export default connect(mapToProps, {
  getVehicleById,
  getAllCitizens,
  transferVehicle,
})(TransferVehiclePage);
