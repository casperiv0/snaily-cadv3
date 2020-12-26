import * as React from "react";
import { connect } from "react-redux";
import Company from "../../interfaces/Company";
import Match from "../../interfaces/Match";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { deleteCompany, updateCompany } from "../../lib/actions/company";
import AlertMessage from "../alert-message";

interface Props {
  company: Company;
  match: Match;
  error: string;
  deleteCompany: (id: string, citizenId: string) => void;
  updateCompany: (id: string, data: object) => void;
}

const EditCompanyTab: React.FC<Props> = ({
  company,
  match,
  error,
  deleteCompany,
  updateCompany,
}) => {
  const [name, setName] = React.useState<string>("");
  const [whitelisted, setWhitelisted] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (company?.name) {
      setName(company?.name);
      setWhitelisted(company?.whitelisted);
      setAddress(company?.address);
    }
  }, [company]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateCompany(company?.id, {
      name,
      whitelisted,
      address,
    });
  }

  function handleDelete() {
    deleteCompany(company?.id, match.params.citizenId);
  }

  return (
    <>
      <form className="mt-2" onSubmit={onSubmit}>
        {error ? <AlertMessage type="warning" message={error} /> : null}
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {lang.citizen.company.name}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="address">
            {lang.citizen.company.address}
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            id="address"
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="whitelisted">
            {lang.citizen.company.whitelisted}
          </label>
          <select
            value={whitelisted}
            onChange={(e) => setWhitelisted(e.target.value)}
            id="whitelisted"
            className="form-control bg-dark border-dark text-light"
          >
            <option value={company?.whitelisted}>
              {company?.whitelisted === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option value="" disabled>
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
        </div>

        <div className="mb-3 float-right">
          <button className="btn btn-primary" type="submit">
            {lang.citizen.company.update_company}
          </button>
        </div>
      </form>

      <button type="button" className="btn btn-danger" onClick={handleDelete}>
        {lang.admin.company.delete_company}
      </button>
    </>
  );
};

const mapToProps = (state: State) => ({
  company: state.company.company,
  error: state.company.error,
});

export default connect(mapToProps, { deleteCompany, updateCompany })(EditCompanyTab);
