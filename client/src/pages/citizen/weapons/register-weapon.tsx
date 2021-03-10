import * as React from "react";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import AlertMessage from "../../../components/alert-message";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import { getWeapons, getLegalStatuses } from "../../../lib/actions/values";
import { connect } from "react-redux";
import { getCitizens, registerWeapon } from "../../../lib/actions/citizen";
import Message from "../../../interfaces/Message";
import { useHistory } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  message: Message | null;
  weapons: Value[];
  legalStatuses: Value[];
  owners: Citizen[];
  getWeapons: () => void;
  getCitizens: () => void;
  getLegalStatuses: () => void;
  registerWeapon: (data: object) => void;
}

const RegisterWeaponPage: React.FC<Props> = ({
  message,
  weapons,
  legalStatuses,
  owners,
  getWeapons,
  getLegalStatuses,
  getCitizens,
  registerWeapon,
}) => {
  const [weapon, setWeapon] = React.useState<string>("");
  const [citizenId, setCitizenId] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const history = useHistory();
  useDocTitle("Register weapon");

  React.useEffect(() => {
    getWeapons();
    getLegalStatuses();
    getCitizens();
  }, [getWeapons, getLegalStatuses, getCitizens]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    registerWeapon({
      weapon,
      citizenId,
      status,
    });
  }

  return (
    <Layout classes="mt-5">
      <AlertMessage message={message} dismissible />

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="weapon">
            {lang.citizen.weapon.enter_weapon}
          </label>
          <select
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option>{lang.global.select}</option>
            <option disabled>--------</option>
            {weapons.map((weapon: Value, idx: number) => {
              return (
                <option key={idx} id={`${idx}`} value={weapon.name}>
                  {weapon.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="owner">
            {lang.citizen.weapon.enter_owner}
          </label>
          <select
            id="owner"
            value={citizenId}
            onChange={(e) => {
              setCitizenId(e.target.value);
            }}
            className="form-control bg-dark border-dark text-light"
          >
            <option value="">{lang.global.select}</option>
            <option disabled>--------</option>
            {owners.map((owner: Citizen, idx: number) => {
              return (
                <option key={idx} id={`${idx}`} value={owner.id}>
                  {owner.full_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            {lang.citizen.weapon.enter_status}
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value="">{lang.global.select}</option>
            <option disabled>--------</option>
            {legalStatuses.map((status: Value, idx: number) => {
              return (
                <option key={idx} id={`${idx}`} value={status.name}>
                  {status.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3 float-end">
          <button type="button" onClick={() => history.goBack()} className="btn btn-danger">
            {lang.global.cancel}
          </button>
          <button type="submit" className="ms-2 btn btn-primary">
            {lang.citizen.weapon.reg_weapon}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
  owners: state.citizen.citizens,
  weapons: state.values.weapons,
  legalStatuses: state.values["legal-statuses"],
});

export default connect(mapToProps, {
  getWeapons,
  getLegalStatuses,
  getCitizens,
  registerWeapon,
})(RegisterWeaponPage);
