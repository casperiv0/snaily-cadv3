import * as React from "react";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Value from "../../../interfaces/Value";
import Citizen from "../../../interfaces/Citizen";
import { connect } from "react-redux";
import { getVehicles } from "../../../lib/actions/values";
import { getCitizens, registerVehicle } from "../../../lib/actions/citizen";
import Company from "../../../interfaces/Company";
import { getCompanies } from "../../../lib/actions/admin";
import CadInfo from "../../../interfaces/CadInfo";
import Select from "../../../components/select";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";

interface Props {
  owners: Citizen[];
  vehicles: Value[];
  legalStatuses: Value[];
  companies: Company[];
  cadInfo: CadInfo | null;
  getVehicles: () => void;
  getCitizens: () => void;
  getCompanies: () => void;
  registerVehicle: (data: object) => Promise<boolean>;
}

const RegisterVehicleModal: React.FC<Props> = ({
  owners,
  vehicles,
  legalStatuses,
  companies,
  cadInfo,
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

  React.useEffect(() => {
    getVehicles();
    getCitizens();
    getCompanies();
  }, [getVehicles, getCitizens, getCompanies]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await registerVehicle({
      plate,
      status,
      color,
      vehicle,
      citizenId,
      businessId: companyId,
    });

    if (success === true) {
      setPlate("");
      setStatus("");
      setColor("");
      setVehicle("");
      setCitizenId("");
      setCompanyId("");

      modal(ModalIds.RegisterVehicle).hide();
    }
  }

  return (
    <Modal size="lg" id={ModalIds.RegisterVehicle} title={window.lang.citizen.vehicle.reg_vehicle}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {lang.citizen.vehicle.enter_plate}
            </label>
            <input
              type="text"
              id="plate"
              value={plate.toUpperCase()}
              onChange={(e) => setPlate(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              maxLength={cadInfo && cadInfo?.plate_length !== 0 ? Number(cadInfo?.plate_length) : 8}
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
              className="form-control bg-secondary border-secondary text-light"
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
              className="form-control bg-secondary border-secondary text-light"
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
              id="owner"
              isMulti={false}
              isClearable={false}
              onChange={(v) => setCitizenId(v.value)}
              options={owners.map((owner: Citizen) => ({
                value: owner.id,
                label: owner.full_name,
              }))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="vehicle_status">
              {lang.citizen.vehicle.select_status}
            </label>

            <Select
              id="vehicle_status"
              isMulti={false}
              isClearable={false}
              onChange={(v) => setStatus(v.value)}
              options={legalStatuses.map((status) => ({
                value: status.name,
                label: status.name,
              }))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="vehicle_company">
              {lang.citizen.vehicle.company}
            </label>

            <Select
              id="vehicle_company"
              isMulti={false}
              isClearable
              onChange={(v) => setCompanyId(v?.value)}
              options={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.citizen.vehicle.reg_vehicle}
          </button>
        </div>
      </form>
    </Modal>
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
  getVehicles,
  getCitizens,
  registerVehicle,
  getCompanies,
})(RegisterVehicleModal);
