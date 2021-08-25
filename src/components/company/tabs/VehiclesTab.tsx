import * as React from "react";
import { connect } from "react-redux";
import { State } from "types/State";
import { Vehicle } from "types/Vehicle";
import { AlertMessage } from "components/AlertMessage/AlertMessage";
import lang from "src/language.json";
import { Item, Span } from "components/Item";

interface Props {
  vehicles: Vehicle[];
}

const VehiclesTabC: React.FC<Props> = ({ vehicles }) => {
  return (
    <ul className="list-group mt-2">
      {!vehicles[0] ? (
        <AlertMessage message={{ msg: lang.citizen.company.no_veh, type: "warning" }} />
      ) : (
        vehicles.map((vehicle: Vehicle, idx: number) => {
          return (
            <li key={idx} className="list-group-item bg-dark border-secondary text-white">
              {++idx} | {vehicle.vehicle}
              <Item id="plate">
                <Span>{lang.global.plate}: </Span>
                {vehicle.plate.toUpperCase()}
              </Item>
              <Item id="status">
                <Span>{lang.citizen.vehicle.status}: </Span>
                {vehicle.in_status}
              </Item>
              <Item id="status">
                <Span>{lang.record.owner}: </Span>
                {vehicle.owner}
              </Item>
            </li>
          );
        })
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  vehicles: state.companies.vehicles,
});

export const VehiclesTab = connect(mapToProps)(VehiclesTabC);
