import * as React from "react";
import { Nullable, State } from "types/State";
import { Vehicle } from "types/Vehicle";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { transferVehicle } from "actions/citizen/CitizenActions";
import { Select } from "components/Select/Select";
import { Modal } from "components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { RequestData } from "lib/utils";
import { Cad } from "types/Cad";
import { searchNames } from "actions/officer/OfficerActions";
import { Name } from "actions/officer/OfficerTypes";

interface Props {
  vehicle: Nullable<Vehicle>;
  owners: Name[];
  cadInfo: Nullable<Cad>;
  getAllCitizens: () => void;
  transferVehicle: (id: string, data: RequestData) => Promise<boolean>;
}

const TransferVehicleModalC: React.FC<Props> = ({
  vehicle,
  owners,
  cadInfo,
  getAllCitizens,
  transferVehicle,
}) => {
  const [plate, setPlate] = React.useState<string>("");
  const [ownerId, setOwnerId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getAllCitizens();
  }, [getAllCitizens]);

  React.useEffect(() => {
    setPlate(vehicle?.plate ?? "");
  }, [vehicle]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle) return;

    setLoading(true);
    await transferVehicle(vehicle?.id, { plate, ownerId });
    setLoading(false);
  }

  return (
    <Modal title="Transfer vehicle" size="lg" id={ModalIds.TransferVehicle}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {lang.global.plate}
            </label>
            <input
              type="text"
              className="form-control bg-secondary border-secondary text-light"
              id="plate"
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              value={plate?.toUpperCase()}
              maxLength={cadInfo?.plate_length ? +cadInfo.plate_length : 8}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="owner">
              {lang.citizen.vehicle.transfer_to}
            </label>

            <Select
              isMulti={false}
              theme="light"
              isClearable={false}
              onChange={(v) => setOwnerId(v.value)}
              options={owners
                .filter((cit) => cit.id !== vehicle?.citizen_id)
                .map((owner) => ({
                  value: owner.id,
                  label: owner.full_name,
                }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.citizen.vehicle.transfer_veh}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  owners: state.officers.names,
  cadInfo: state.global.cadInfo,
});

export const TransferVehicleModal = connect(mapToProps, {
  getAllCitizens: searchNames,
  transferVehicle,
})(TransferVehicleModalC);
