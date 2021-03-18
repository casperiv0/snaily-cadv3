import * as React from "react";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import { getWeapons, getLegalStatuses } from "../../../lib/actions/values";
import { connect } from "react-redux";
import { getCitizens, registerWeapon } from "../../../lib/actions/citizen";
import { useHistory } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";
import Select from "../../../components/select";

interface Props {
  weapons: Value[];
  legalStatuses: Value[];
  owners: Citizen[];
  getWeapons: () => void;
  getCitizens: () => void;
  getLegalStatuses: () => void;
  registerWeapon: (data: object) => Promise<boolean>;
}

const RegisterWeaponPage: React.FC<Props> = ({
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
  const [serial, setSerial] = React.useState<string>("");
  const history = useHistory();
  useDocTitle("Register weapon");

  React.useEffect(() => {
    getWeapons();
    getLegalStatuses();
    getCitizens();
  }, [getWeapons, getLegalStatuses, getCitizens]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const registered = await registerWeapon({
      weapon,
      citizenId,
      status,
      serial_number: serial.toUpperCase(),
    });

    if (registered === true) {
      history.push(`/citizen/${citizenId}`);
    }
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="weapon">
            {lang.citizen.weapon.enter_weapon}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setWeapon(v.value)}
            options={weapons.map((weapon) => ({
              value: weapon.name,
              label: weapon.name,
            }))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="owner">
            {lang.citizen.weapon.enter_owner}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setCitizenId(v.value)}
            options={owners.map((owner) => ({
              value: owner.id,
              label: owner.full_name,
            }))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            {lang.citizen.weapon.enter_status}
          </label>

          <Select
            isMulti={false}
            theme="dark"
            isClearable={false}
            onChange={(v) => setStatus(v.value)}
            options={legalStatuses.map((status) => ({
              value: status.name,
              label: status.name,
            }))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            Custom Serial number (Optional)
          </label>

          <input
            value={serial.toUpperCase()}
            onChange={(e) => setSerial(e.target.value?.toUpperCase())}
            className="bg-dark border-dark form-control text-light"
          />
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
