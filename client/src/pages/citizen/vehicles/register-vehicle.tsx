import * as React from "react";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Value from "../../../interfaces/Value";
import Citizen from "../../../interfaces/Citizen";
import { connect } from "react-redux";
import { getLegalStatuses, getVehicles } from "../../../lib/actions/values";
import { getCitizens, registerVehicle } from "../../../lib/actions/citizen";
import Company from "../../../interfaces/Company";
import { getCompanies } from "../../../lib/actions/admin";
import { useHistory } from "react-router-dom";
import CadInfo from "../../../interfaces/CadInfo";
import useDocTitle from "../../../hooks/useDocTitle";
import Select from "../../../components/select";

interface Props {
  owners: Citizen[];
  vehicles: Value[];
  legalStatuses: Value[];
  companies: Company[];
  cadInfo: CadInfo | null;
  getLegalStatuses: () => void;
  getVehicles: () => void;
  getCitizens: () => void;
  getCompanies: () => void;
  registerVehicle: (data: object) => void;
}

const RegisterVehiclePage: React.FC<Props> = ({
  owners,
  vehicles,
  legalStatuses,
  companies,
  cadInfo,
  getLegalStatuses,
  getVehicles,
  getCitizens,
  registerVehicle,
  getCompanies,
}) => {
  const [plate, setPlate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [color, setColor] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [citizenId, setCitizenId] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const history = useHistory();
  useDocTitle("Register vehicle");

  React.useEffect(() => {
    getLegalStatuses();
    getVehicles();
    getCitizens();
    getCompanies();
  }, [getVehicles, getLegalStatuses, getCitizens, getCompanies]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    registerVehicle({
      plate,
      status,
      color,
      vehicle,
      citizenId,
      businessId: companyId,
    });
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="plate">
            {lang.citizen.vehicle.enter_plate}
          </label>
          <input
            type="text"
            id="plate"
            value={plate.toUpperCase()}
            onChange={(e) => setPlate(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            maxLength={cadInfo?.plate_length !== 0 ? Number(cadInfo?.plate_length) : 8}
            minLength={1}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="color">
            {lang.citizen.vehicle.enter_color}
          </label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="vehicle">
            {lang.citizen.vehicle.enter_vehicle}
          </label>
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
              .sort((a, b) => Number(a?.defaults) - Number(b?.defaults))
              .map((vehicle: Value, idx: number) => {
                return (
                  <option value={vehicle.name} key={idx} id={`${idx}`}>
                    {vehicle.name}
                  </option>
                );
              })}
          </datalist>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="owner">
            {lang.citizen.vehicle.select_owner}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setCitizenId(v.value)}
            options={owners.map((owner: Citizen) => ({
              value: owner.id,
              label: owner.full_name,
            }))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            {lang.citizen.vehicle.select_status}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setStatus(v.value)}
            options={legalStatuses.map((status) => ({
              value: status.name,
              label: status.name,
            }))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            {lang.citizen.vehicle.company}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setCompanyId(v.value)}
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
          />
        </div>

        <div className="mb-3 float-end">
          <button onClick={() => history.goBack()} type="button" className="btn btn-danger">
            {lang.global.cancel}
          </button>
          <button type="submit" className="ms-2 btn btn-primary">
            {lang.citizen.vehicle.reg_vehicle}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  owners: state.citizen.citizens,
  vehicles: state.values.vehicles,
  legalStatuses: state.values["legal-statuses"],
  companies: state.admin.companies,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps, {
  getLegalStatuses,
  getVehicles,
  getCitizens,
  registerVehicle,
  getCompanies,
})(RegisterVehiclePage);
