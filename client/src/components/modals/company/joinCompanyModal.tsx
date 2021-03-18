import * as React from "react";
import { connect } from "react-redux";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import Company from "../../../interfaces/Company";
import State from "../../../interfaces/State";
import { joinCompany } from "../../../lib/actions/company";
import Select, { Value } from "../../select";

interface Props {
  citizens: Citizen[];
  companies: Company[];
  joinCompany: (data: object) => void;
}

const JoinCompanyModal: React.FC<Props> = ({ citizens, companies, joinCompany }) => {
  const [citizenId, setCitizenId] = React.useState<Value | null>(null);
  const [companyId, setCompanyId] = React.useState<Value | null>(null);

  React.useEffect(() => {}, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    joinCompany({
      citizen_id: citizenId?.value,
      company_id: companyId?.value,
    });
  }

  return (
    <Modal id="joinCompanyModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.citizen.company.join}</h5>
        <XButton />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="citizen">
              {lang.citizen.company.select_cit}
            </label>
            {!citizens[0] ? (
              <p>{lang.citizen.company.no_cit}</p>
            ) : (
              <Select
                closeMenuOnSelect
                onChange={(v) => setCitizenId(v)}
                isMulti={false}
                value={citizenId}
                options={citizens.map((citizen) => ({
                  value: citizen.id,
                  label: citizen.full_name,
                }))}
              />
            )}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="company">
              {lang.citizen.company.select_com}
            </label>
            {!companies[0] ? (
              <p>{lang.citizen.company.no_com}</p>
            ) : (
              <Select
                isMulti={false}
                value={companyId}
                onChange={(v) => setCompanyId(v)}
                options={companies.map((company) => ({ value: company.id, label: company.name }))}
              />
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button
            disabled={!citizenId?.value || !companyId?.value}
            type="submit"
            className="btn btn-primary"
          >
            {lang.citizen.company.join}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.company.citizens,
  companies: state.company.companies,
});

export default connect(mapToProps, { joinCompany })(JoinCompanyModal);
