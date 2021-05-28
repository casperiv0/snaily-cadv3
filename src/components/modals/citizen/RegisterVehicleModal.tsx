import * as React from "react";
import { Nullable, State } from "types/State";
import { useRouter } from "next/router";
import lang from "../../../language.json";
import { Value } from "types/Value";
import { Citizen } from "types/Citizen";
import { connect } from "react-redux";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { registerVehicle } from "@actions/citizen/CitizenActions";
import { getCompanies } from "@actions/companies/CompanyActions";
import { Cad } from "types/Cad";
import { Select, SelectValue } from "@components/Select/Select";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { isCadFeatureEnabled, modal, notify, RequestData } from "@lib/utils";
import { ValuePaths } from "types/ValuePaths";
import { Company } from "types/Company";

interface Props {
  owners: Citizen[];
  vehicles: Value[];
  cadLicenses: Value[];
  companies: Company[];
  cadInfo: Nullable<Cad>;
  citizen: Nullable<Citizen>;

  getValuesByPath: (path: ValuePaths) => void;
  getCompanies: () => void;
  registerVehicle: (data: RequestData) => Promise<boolean>;
}

const RegisterVehicleModalC: React.FC<Props> = ({
  owners,
  vehicles,
  cadLicenses,
  companies,
  cadInfo,
  citizen,
  getValuesByPath,
  registerVehicle,
  getCompanies,
}) => {
  const [plate, setPlate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [color, setColor] = React.useState("");
  const [vehicle, setVehicle] = React.useState<SelectValue | null>(null);
  const [customVehicle, setCustomVehicle] = React.useState("");
  const [citizenId, setCitizenId] = React.useState<Nullable<SelectValue>>(null);
  const [companyId, setCompanyId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const location = useRouter();

  const allVehicles = [{ defaults: 1, name: lang.global.other, value: "1" }, ...vehicles];

  React.useEffect(() => {
    getValuesByPath("vehicles");
    getCompanies();
  }, [getValuesByPath, getCompanies]);

  React.useEffect(() => {
    if (citizen) {
      setCitizenId({ label: citizen?.full_name, value: citizen?.id });
    }

    if (location.pathname === "/citizen") {
      setCitizenId(null);
    }
  }, [location.pathname, citizen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!citizenId?.value) {
      return notify.warn("Please fill in all fields");
    }

    setLoading(true);
    const success = await registerVehicle({
      plate,
      status,
      color,
      vehicle: vehicle?.value === lang.global.other ? customVehicle : vehicle?.value,
      citizenId: citizenId?.value,
      companyId,
    });

    if (success === true) {
      setPlate("");
      setStatus("");
      setColor("");
      setVehicle(null);
      setCitizenId(null);
      setCompanyId("");
      setCustomVehicle("");

      modal(ModalIds.RegisterVehicle)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" id={ModalIds.RegisterVehicle} title={lang.citizen.vehicle.reg_vehicle}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {lang.citizen.vehicle.enter_plate}
            </label>
            <input
              type="text"
              id="register_plate"
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
              id="register_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="vehicle">
              {lang.citizen.vehicle.enter_vehicle}
            </label>

            <Select
              theme="light"
              value={vehicle}
              isMulti={false}
              isClearable={false}
              closeMenuOnSelect
              onChange={(v) => setVehicle(v)}
              options={allVehicles
                .sort((a, b) => Number(a?.defaults) - Number(b?.defaults))
                .map((ve) => ({
                  label: ve.name,
                  value: ve.name,
                }))}
            />

            {vehicle?.value === lang.global.other ? (
              <input
                value={customVehicle}
                onChange={(e) => setCustomVehicle(e.target.value)}
                className="form-control bg-secondary border-secondary text-light mt-2"
                placeholder={lang.citizen.other_vehicle ?? "Enter custom vehicle"}
              />
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="owner">
              {lang.citizen.vehicle.select_owner}
            </label>

            <Select
              disabled={location.pathname !== "/citizen" && !!citizen}
              value={citizenId}
              id="register_owner"
              isMulti={false}
              isClearable={false}
              onChange={setCitizenId}
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
              id="register_vehicle_status"
              isMulti={false}
              isClearable={false}
              onChange={(v) => setStatus(v.value)}
              options={cadLicenses.map((status) => ({
                value: status.name,
                label: status.name,
              }))}
            />
          </div>

          {isCadFeatureEnabled(cadInfo?.features, "company") ? (
            <div className="mb-3">
              <label className="form-label" htmlFor="vehicle_company">
                {lang.citizen.vehicle.company}
              </label>

              <Select
                id="register_vehicle_company"
                isMulti={false}
                isClearable
                onChange={(v) => setCompanyId(v?.value)}
                options={companies.map((company) => ({
                  value: company.id,
                  label: company.name,
                }))}
              />
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.citizen.vehicle.reg_vehicle}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  owners: state.citizen.citizens,
  vehicles: state.values.vehicles,
  cadLicenses: state.values["cad-licenses"],
  companies: state.companies.companies,
  cadInfo: state.global.cadInfo,
  citizen: state.citizen.citizen,
});

export const RegisterVehicleModal = connect(mapToProps, {
  getValuesByPath,
  registerVehicle,
  getCompanies,
})(RegisterVehicleModalC);
