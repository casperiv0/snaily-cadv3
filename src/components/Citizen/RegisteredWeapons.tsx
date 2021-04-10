import * as React from "react";
import { connect } from "react-redux";
import lang from "../../language.json";
import { Nullable, State } from "types/State";
import { Weapon } from "types/Weapon";
import { deleteWeaponById } from "@actions/citizen/CitizenActions";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "@components/Item";

interface Props {
  citizenId: Nullable<string>;
  weapons: Weapon[];
  deleteWeaponById: (citizenId: string, id: string) => void;
}

const RegisteredWeaponsC: React.FC<Props> = ({ citizenId, weapons, deleteWeaponById }) => {
  return (
    <div className="card bg-dark border-dark mt-1 text-light">
      <div className="card-header">
        <h1 className="h4">{lang.citizen.weapon.reged_weapons}</h1>
      </div>

      <div className="card-body">
        {!weapons[0] ? (
          <div className="list-group-item bg-secondary border-secondary mt-2 d-flex justify-content-between text-white">
            {lang.citizen.weapon.no_weapons}
            <button
              data-bs-target={`#${ModalIds.RegisterWeapon}`}
              data-bs-toggle="modal"
              className="btn btn-primary"
            >
              {lang.citizen.weapon.reg_a_weapon}
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#registered_weapons"
              aria-expanded="false"
              aria-controls="registered_weapons"
            >
              {lang.citizen.weapon.toggle_weapon}
            </button>
            <button
              data-bs-target={`#${ModalIds.RegisterWeapon}`}
              data-bs-toggle="modal"
              className="btn btn-primary ms-2"
            >
              {lang.citizen.weapon.reg_a_weapon}
            </button>

            <ul className="collapse list-group mt-2" id="registered_weapons">
              {weapons.map((weapon: Weapon, idx: number) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-secondary border-dark d-flex justify-content-between text-white"
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
                        onClick={() => deleteWeaponById(citizenId!, weapon.id)}
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
  citizenId: state.citizen.citizen?.id ?? null,
});

export const RegisteredWeapons = connect(mapToProps, { deleteWeaponById })(RegisteredWeaponsC);
