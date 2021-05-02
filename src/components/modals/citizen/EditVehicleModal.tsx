import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import lang from "../../../language.json";
import { Value } from "types/Value";
import { Citizen } from "types/Citizen";
import { updateVehicleById } from "@actions/citizen/CitizenActions";
import { Cad } from "types/Cad";
import { Select } from "@components/Select/Select";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { isCadFeatureEnabled, modal, RequestData } from "@lib/utils";
import { Company } from "types/Company";
import { Vehicle } from "types/Vehicle";

interface Props {
  vehicle: Nullable<Vehicle>;
  cadLicenses: Value[];
  companies: Company[];
  cadInfo: Nullable<Cad>;
  citizen: Nullable<Citizen>;

  updateVehicleById: (citizenId: string, vehicleId: string, data: RequestData) => Promise<boolean>;
}

const EditVehicleModalC: React.FC<Props> = ({
  cadLicenses,
  companies,
  cadInfo,
  vehicle: tempVehicle,
  updateVehicleById,
}) => {
  const [plate, setPlate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [color, setColor] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setPlate(tempVehicle?.plate ?? "");
    setStatus(tempVehicle?.in_status ?? "");
    setColor(tempVehicle?.color ?? "");
    setVehicle(tempVehicle?.vehicle ?? "");
    setCompanyId(tempVehicle?.company ?? "");
  }, [tempVehicle]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tempVehicle) return;
    setLoading(true);

    const success = await updateVehicleById(tempVehicle?.citizen_id, tempVehicle?.id, {
      status,
      color,
      companyId,
    });

    if (success === true) {
      setStatus("");
      setColor("");
      setVehicle("");
      setCompanyId("");

      modal(ModalIds.EditVehicle)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" id={ModalIds.EditVehicle} title={lang.citizen.edit_reg_vehicle}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {lang.citizen.vehicle.enter_plate}
            </label>
            <input
              type="text"
              id="edit_plate"
              defaultValue={plate.toUpperCase()}
              className="form-control bg-secondary border-secondary text-light cursor-not-allowed"
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="color">
              {lang.citizen.vehicle.enter_color}
            </label>
            <input
              type="text"
              id="edit_color"
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
              id="edit_vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="vehicle_status">
              {lang.citizen.vehicle.select_status}
            </label>

            <Select
              value={{ label: status, value: status }}
              id="edit_vehicle_status"
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
                id="edit_vehicle_company"
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
            {loading ? `${lang.global.loading}..` : lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  cadLicenses: state.values["cad-licenses"],
  companies: state.companies.companies,
  cadInfo: state.global.cadInfo,
  citizen: state.citizen.citizen ?? null,
});

export const EditVehicleModal = connect(mapToProps, {
  updateVehicleById,
})(EditVehicleModalC);
