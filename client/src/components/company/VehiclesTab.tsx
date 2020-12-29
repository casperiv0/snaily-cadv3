import * as React from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import Vehicle from "../../interfaces/Vehicle";
import AlertMessage from "../alert-message";
import lang from "../../language.json";
import { Item, Span } from "../../pages/citizen/citizen-info";

interface Props {
  vehicles: Vehicle[];
}

const VehiclesTab: React.FC<Props> = ({ vehicles }) => {
  return (
    <ul className="list-group mt-2">
      {!vehicles[0] ? (
        <AlertMessage message={{ msg: lang.citizen.company.no_veh, type: "warning" }} />
      ) : (
        vehicles.map((vehicle: Vehicle, idx: number) => {
          return (
            <li key={idx} className="list-group-item bg-dark border-secondary">
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
  vehicles: state.company.vehicles,
});

export default connect(mapToProps)(VehiclesTab);
