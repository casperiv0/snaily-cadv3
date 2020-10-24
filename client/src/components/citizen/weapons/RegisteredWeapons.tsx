import * as React from "react";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Weapon from "../../../interfaces/Weapon";
import { connect } from "react-redux";
import {
  getRegisteredWeapons,
  deleteWeapon,
} from "../../../lib/actions/citizen";
import { Item, Span } from "../../../pages/citizen/citizen-info";

interface Props {
  citizenId: string;
  weapons: Weapon[];
  getRegisteredWeapons: (id: string) => void;
  deleteWeapon: (citizenId: string, weaponId: string) => void;
}

const RegisteredWeapons: React.FC<Props> = ({
  citizenId,
  weapons,
  getRegisteredWeapons,
  deleteWeapon,
}) => {
  React.useEffect(() => {
    getRegisteredWeapons(citizenId);
  }, [getRegisteredWeapons, citizenId]);

  return (
    <div className="card bg-dark border-dark mt-1 text-light">
      <div className="card-header">
        <h5 className="mb-1">{lang.citizen.weapon.reged_weapons}</h5>
      </div>

      <div className="card-body">
        {!weapons[0] ? (
          <li className="list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between">
            {lang.citizen.weapon.no_weapons}
            <a href="/weapons/register" className="btn btn-primary">
              {lang.citizen.weapon.reg_a_weapon}
            </a>
          </li>
        ) : (
          <>
            <button
              className="btn btn-secondary mt-2"
              type="button"
              data-toggle="collapse"
              data-target="#registered_weapons"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              {lang.citizen.weapon.toggle_weapon}
            </button>
            <ul className="collapse mt-2" id="registered_weapons">
              {weapons.map((weapon: Weapon, idx: number) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-secondary border-dark d-flex justify-content-between"
                  >
                    <div>
                      <Item id="weapon">
                        <Span>{weapon.weapon}</Span>
                      </Item>
                      <Item id="serial_number">
                        <Span>{lang.citizen.weapon.serial_number}: </Span>
                        {weapon.serial_number}
                      </Item>
                      <Item id="status">
                        <Span>{lang.citizen.weapon.status}: </Span>
                        {weapon.status}
                      </Item>
                    </div>

                    <div>
                      <button
                        onClick={() => deleteWeapon(citizenId, weapon.id)}
                        className="btn btn-danger"
                      >
                        {lang.global.delete}
                      </button>
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
  weapons: state.citizen.weapons,
});

export default connect(mapToProps, { getRegisteredWeapons, deleteWeapon })(
  RegisteredWeapons
);
