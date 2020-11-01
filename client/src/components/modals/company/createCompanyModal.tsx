import * as React from "react";
import { connect } from "react-redux";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Citizen from "../../../interfaces/Citizen";
import { createCompany } from "../../../lib/actions/company";
import AlertMessage from "../../alert-message";

interface Props {
  citizens: Citizen[];
  createCompany: (data: object) => void;
  error: string;
}

const CreateCompanyModal: React.FC<Props> = ({ citizens, error, createCompany }) => {
  const [address, setAddress] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [whitelist, setWhitelist] = React.useState<string>("no");
  const [ownerId, setOwnerId] = React.useState<string>("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCompany({
      address,
      name,
      whitelist,
      owner_id: ownerId,
    });
  }

  return (
    <Modal id="createCompanyModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.citizen.company.create}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {error ? <AlertMessage type="warning" message={error} /> : null}
          <div className="form-group">
            <label htmlFor="company_name">{lang.citizen.company.name}</label>
            <input
              type="text"
              id="company_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">{lang.citizen.company.address}</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="form-group">
            <label htmlFor="whitelist">{lang.citizen.company.whitelisted}</label>
            <select
              id="whitelist"
              value={whitelist}
              onChange={(e) => setWhitelist(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            >
              <option value="0">{lang.global.no}</option>
              <option value="1">{lang.global.yes}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ownerId">{lang.citizen.company.select_owner}</label>
            <select
              id="ownerId"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            >
              <option value="">{lang.global?.select}</option>
              <option value="" disabled>
                --------
              </option>
              {citizens.map((citizen: Citizen, idx: number) => {
                return (
                  <option key={idx} value={citizen.id}>
                    {citizen.full_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.citizen.company.create}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.company.error,
  citizens: state.company.citizens,
});

export default connect(mapToProps, { createCompany })(CreateCompanyModal);
