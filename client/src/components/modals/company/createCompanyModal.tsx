import * as React from "react";
import { connect } from "react-redux";
import Modal from "../index";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Citizen from "../../../interfaces/Citizen";
import { createCompany } from "../../../lib/actions/company";
import Select, { Value } from "../../select";
import { ModalIds } from "../../../lib/types";

interface Props {
  citizens: Citizen[];
  createCompany: (data: object) => void;
}

const CreateCompanyModal: React.FC<Props> = ({ citizens, createCompany }) => {
  const [address, setAddress] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [whitelist, setWhitelist] = React.useState<string>("no");
  const [ownerId, setOwnerId] = React.useState<Value | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCompany({
      address,
      name,
      whitelist,
      owner_id: ownerId?.value,
    });
  }

  return (
    <Modal title={lang.citizen.company.create} id={ModalIds.CreateCompany}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="company_name">
              {lang.citizen.company.name}
            </label>
            <input
              type="text"
              id="company_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="address">
              {lang.citizen.company.address}
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="whitelist">
              {lang.citizen.company.whitelisted}
            </label>

            <Select
              closeMenuOnSelect
              isMulti={false}
              onChange={(v) => setWhitelist(v?.value)}
              options={[
                { label: lang.global.yes, value: "1" },
                { label: lang.global.no, value: "0" },
              ]}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="ownerId">
              {lang.citizen.company.select_owner}
            </label>

            <Select
              closeMenuOnSelect
              onChange={(v) => setOwnerId(v)}
              isMulti={false}
              value={ownerId}
              options={citizens.map((citizen) => ({
                value: citizen.id,
                label: citizen.full_name,
              }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button
            disabled={!name || !address || !ownerId?.value || !whitelist}
            type="submit"
            className="btn btn-primary"
          >
            {lang.citizen.company.create}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.company.citizens,
});

export default connect(mapToProps, { createCompany })(CreateCompanyModal);
