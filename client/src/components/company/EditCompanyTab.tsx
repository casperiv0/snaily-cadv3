import * as React from "react";
import { connect } from "react-redux";
import Company from "../../interfaces/Company";
import Match from "../../interfaces/Match";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { deleteCompany, updateCompany } from "../../lib/actions/company";
import AlertMessage from "../alert-message";
import Select, { Value } from "../select";

interface Props {
  company: Company | null;
  match: Match;
  error: string | null;
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
  const [whitelisted, setWhitelisted] = React.useState<Value | null>(null);
  const [address, setAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (company?.name) {
      setName(company?.name);
      setWhitelisted({
        label: company?.whitelisted === "1" ? lang.global.yes : lang.global.no,
        value: company?.whitelisted,
      });
      setAddress(company?.address);
    }
  }, [company]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company?.id) {
      return alert("An error occurred EDIT_COMPANY_TAB_LINE_40#onSubmit");
    }

    updateCompany(company?.id, {
      name,
      whitelisted: whitelisted?.value,
      address,
    });
  }

  function handleDelete() {
    if (!company?.id) {
      return alert("An error occurred EDIT_COMPANY_TAB_LINE_52#handleDelete");
    }
    deleteCompany(company?.id, match.params.citizenId);
  }

  return (
    <>
      <form className="mt-2" onSubmit={onSubmit}>
        {error ? <AlertMessage message={{ msg: error, type: "warning" }} /> : null}
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

          <Select
            theme="dark"
            closeMenuOnSelect
            isMulti={false}
            onChange={(v) => setWhitelisted(v)}
            value={whitelisted}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>

        <div className="mb-3 float-end">
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
