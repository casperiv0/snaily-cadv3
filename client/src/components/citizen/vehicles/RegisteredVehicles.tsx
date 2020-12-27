import * as React from "react";
import State from "../../../interfaces/State";
import Vehicle from "../../../interfaces/Vehicle";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { getRegisteredVehicles, reportAsStolen, deleteVehicle } from "../../../lib/actions/citizen";
import { Item, Span } from "../../../pages/citizen/citizen-info";

interface Props {
  citizenId: string;
  vehicles: Vehicle[];
  getRegisteredVehicles: (id: string) => void;
  reportAsStolen: (id: string) => void;
  deleteVehicle: (citizenId: string, vehicleId: string) => void;
}

const RegisteredVehicles: React.FC<Props> = ({
  citizenId,
  vehicles,
  getRegisteredVehicles,
  reportAsStolen,
  deleteVehicle,
}) => {
  React.useEffect(() => {
    getRegisteredVehicles(citizenId);
  }, [getRegisteredVehicles, citizenId]);

  return (
    <div className="card bg-dark border-dark mt-1 text-light">
      <div className="card-header">
        <h1 className="h4">{lang.citizen.vehicle.reged_vehicle}</h1>
      </div>

      <div className="card-body">
        {!vehicles[0] ? (
          <div className="list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between">
            {lang.citizen.vehicle.no_veh}
            <a href="/vehicles/register" className="btn btn-primary">
              {lang.citizen.vehicle.reg_a_vehicle}
            </a>
          </div>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              type="button"
              data-toggle="collapse"
              data-bs-target="#registered_vehicles"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              {lang.citizen.vehicle.toggle_veh}
            </button>
            <a href="/vehicles/register" className="btn btn-primary ms-2">
              {lang.citizen.vehicle.reg_a_vehicle}
            </a>
            <ul className="list-group collapse mt-2" id="registered_vehicles">
              {vehicles.map((vehicle: Vehicle, idx: number) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-secondary border-dark d-flex justify-content-between"
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
                      <a className="btn btn-dark me-2" href={`/vehicles/transfer/${vehicle.id}`}>
                        {lang.citizen.vehicle.transfer}
                      </a>

                      {vehicle.in_status === "Reported stolen" ? null : (
                        <button
                          className="btn btn-dark me-2"
                          onClick={() => reportAsStolen(vehicle.id)}
                        >
                          {lang.citizen.vehicle.report_stolen}
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteVehicle(citizenId, vehicle.id)}
                      >
                        {lang.global.delete}
                      </button>
                      <a className="btn btn-success ms-2" href={`/vehicles/edit/${vehicle.id}`}>
                        {lang.global.edit}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

const mapToProps = (state: State) => ({
  vehicles: state.citizen.vehicles,
});

export default connect(mapToProps, {
  getRegisteredVehicles,
  reportAsStolen,
  deleteVehicle,
})(RegisteredVehicles);
