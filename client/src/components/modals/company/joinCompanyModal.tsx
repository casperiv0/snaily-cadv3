import * as React from "react";
import { connect } from "react-redux";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import Company from "../../../interfaces/Company";
import AlertMessage from "../../alert-message";
import State from "../../../interfaces/State";
import { joinCompany } from "../../../lib/actions/company";
import Message from "../../../interfaces/Message";

interface Props {
  citizens: Citizen[];
  message: Message;
  companies: Company[];
  joinCompany: (data: object) => void;
}

const JoinCompanyModal: React.FC<Props> = ({ citizens, message, companies, joinCompany }) => {
  const [citizenId, setCitizenId] = React.useState<string>("");
  const [companyId, setCompanyId] = React.useState<string>("");

  React.useEffect(() => {}, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    joinCompany({
      citizen_id: citizenId,
      company_id: companyId,
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
          <AlertMessage message={message} dismissible />
          <div className="mb-3">
            <label className="form-label" htmlFor="citizen">
              {lang.citizen.company.select_cit}
            </label>
            {!citizens[0] ? (
              <p>{lang.citizen.company.no_cit}</p>
            ) : (
              <select
                className="form-control bg-secondary border-secondary text-light"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                id="citizen"
              >
                <option value="">{lang.global?.select}..</option>
                <option value="" disabled>
                  -------
                </option>
                {citizens.map((citizen: Citizen, idx: number) => {
                  return (
                    <option key={idx} value={citizen.id}>
                      {citizen.full_name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="company">
              {lang.citizen.company.select_com}
            </label>
            {!companies[0] ? (
              <p>{lang.citizen.company.no_com}</p>
            ) : (
              <select
                className="form-control bg-secondary border-secondary text-light"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                id="company"
              >
                <option value="">{lang.global?.select}..</option>
                <option value="" disabled>
                  -------
                </option>
                {companies.map((company: Company, idx: number) => {
                  return (
                    <option key={idx} value={company.id}>
                      {company.name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
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
  message: state.global.message,
});

export default connect(mapToProps, { joinCompany })(JoinCompanyModal);
