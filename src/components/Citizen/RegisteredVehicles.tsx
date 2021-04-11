import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Nullable, State } from "types/State";
import { Vehicle } from "types/Vehicle";
import lang from "../../language.json";
import { updateVehicleById, deleteVehicleById } from "@actions/citizen/CitizenActions";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "@components/Item";
import { RequestData } from "@lib/utils";
import { EditVehicleModal } from "@components/modals/citizen/EditVehicleModal";

interface Props {
  citizenId: Nullable<string>;
  vehicles: Vehicle[];
  updateVehicleById: (citizenId: string, vehicleId: string, data: RequestData) => void;
  deleteVehicleById: (citizenId: string, vehicleId: string) => void;
}

const RegisteredVehicles: React.FC<Props> = ({
  citizenId,
  vehicles,
  updateVehicleById,
  deleteVehicleById,
}) => {
  const [tempVehicle, setTempVehicle] = React.useState<Nullable<Vehicle>>(null);

  function handleReport(vehicle: Vehicle) {
    if (!citizenId) return;
    updateVehicleById(citizenId, vehicle.id, {
      ...vehicle,
      in_status: "Reported stolen",
    });
  }

  return (
    <div className="card bg-dark border-dark mt-1 text-light">
      <div className="card-header">
        <h1 className="h4">{lang.citizen.vehicle.reged_vehicle}</h1>
      </div>

      <div className="card-body">
        {!vehicles[0] ? (
          <div className="list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between text-white">
            {lang.citizen.vehicle.no_veh}
            <button
              data-bs-target={`#${ModalIds.RegisterVehicle}`}
              data-bs-toggle="modal"
              className="btn btn-primary"
            >
              {lang.citizen.vehicle.reg_a_vehicle}
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#registered_vehicles"
              aria-expanded="false"
              aria-controls="registered_vehicles"
            >
              {lang.citizen.vehicle.toggle_veh}
            </button>
            <button
              data-bs-toggle="modal"
              data-bs-target={`#${ModalIds.RegisterVehicle}`}
              className="btn btn-primary ms-2"
            >
              {lang.citizen.vehicle.reg_a_vehicle}
            </button>
            <ul className="list-group collapse mt-2" id="registered_vehicles">
              {vehicles.map((vehicle: Vehicle, idx: number) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-secondary border-dark d-flex justify-content-between text-white"
                  >
                    <div>
                      <Item id="vehicle">
                        <Span>{vehicle.vehicle}</Span>
                      </Item>
                      <Item id="plate">
                        <Span>{lang.global.plate}: </Span>
                        {vehicle.plate.toUpperCase()}
                      </Item>
                      <Item id="vin_number">
                        <Span>{lang.citizen.vehicle.vin}: </Span>
                        {vehicle.vin_number}
                      </Item>
                      <Item id="status">
                        <Span>{lang.citizen.vehicle.status}: </Span>
                        {vehicle.in_status}
                      </Item>
                      <Item id="color">
                        <Span>{lang.global.color}: </Span>
                        {vehicle.color}
                      </Item>
                    </div>

                    {/* actions */}
                    <div id="actions">
                      <Link href={`/vehicles/transfer/${vehicle.id}`}>
                        <a className="btn btn-dark me-2">{lang.citizen.vehicle.transfer}</a>
                      </Link>

                      {vehicle.in_status === "Reported stolen" ? null : (
                        <button className="btn btn-dark me-2" onClick={() => handleReport(vehicle)}>
                          {lang.citizen.vehicle.report_stolen}
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteVehicleById(citizenId!, vehicle.id)}
                      >
                        {lang.global.delete}
                      </button>
                      <button
                        onClick={() => setTempVehicle(vehicle)}
                        className="btn btn-success ms-2"
                        data-bs-toggle="modal"
                        data-bs-target={`#${ModalIds.EditVehicle}`}
                      >
                        {lang.global.edit}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <EditVehicleModal vehicle={tempVehicle} />
    </div>
  );
};

const mapToProps = (state: State) => ({
  vehicles: state.citizen.vehicles,
  citizenId: state.citizen.citizen?.id ?? null,
});

export default connect(mapToProps, {
  updateVehicleById,
  deleteVehicleById,
})(RegisteredVehicles);
