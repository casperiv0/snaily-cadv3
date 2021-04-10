import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { State } from "types/State";
import { Value } from "types/Value";
import lang from "../../../language.json";
import { Citizen } from "types/Citizen";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { registerWeapon } from "@actions/citizen/CitizenActions";
import { Select, SelectValue } from "@components/Select/Select";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal, notify, RequestData } from "@lib/utils";
import { ValuePaths } from "types/ValuePaths";

interface Props {
  weapons: Value[];
  legalStatuses: Value[];
  owners: Citizen[];
  citizen: Citizen | null;

  getValuesByPath: (path: ValuePaths) => void;
  registerWeapon: (data: RequestData) => Promise<boolean>;
}

const RegisterWeaponModalC: React.FC<Props> = ({
  weapons,
  legalStatuses,
  owners,
  citizen,
  getValuesByPath,
  registerWeapon,
}) => {
  const [weapon, setWeapon] = React.useState<string>("");
  const [citizenId, setCitizenId] = React.useState<SelectValue | null>(null);
  const [status, setStatus] = React.useState<string>("");
  const [serial, setSerial] = React.useState<string>("");
  const router = useRouter();

  React.useEffect(() => {
    getValuesByPath("weapons");
    if (citizen) {
      setCitizenId({ value: citizen.id, label: citizen.full_name });
    }

    if (router.pathname === "/citizen") {
      getValuesByPath("legal-statuses");
      setCitizenId(null);
    }
  }, [getValuesByPath, router, citizen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!citizenId?.value) {
      return notify.warn("Please fill in all fields");
    }

    const success = await registerWeapon({
      weapon,
      citizenId: citizenId?.value,
      status,
      serial_number: serial.toUpperCase(),
    });

    if (success === true) {
      modal(ModalIds.RegisterWeapon)?.hide();
      setWeapon("");
      setCitizenId(null);
      setStatus("");
      setSerial("");
    }
  }

  return (
    <Modal size="lg" title={lang.citizen.weapon.reg_weapon} id={ModalIds.RegisterWeapon}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="weapon">
              {lang.citizen.weapon.enter_weapon}
            </label>

            <Select
              isMulti={false}
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
              disabled={router.pathname !== "/citizen" && !!citizen}
              isMulti={false}
              isClearable={false}
              value={citizenId}
              onChange={(v) => setCitizenId(v)}
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
              {lang.citizen.weapon_custom_serial}
            </label>

            <input
              value={serial.toUpperCase()}
              onChange={(e) => setSerial(e.target.value?.toUpperCase())}
              className="bg-secondary border-secondary form-control text-light"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.citizen.weapon.reg_weapon}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  owners: state.citizen.citizens,
  citizen: state.citizen.citizen,
  weapons: state.values.weapons,
  legalStatuses: state.values["legal-statuses"],
});

export const RegisterWeaponModal = connect(mapToProps, {
  getValuesByPath,
  registerWeapon,
})(RegisterWeaponModalC);
