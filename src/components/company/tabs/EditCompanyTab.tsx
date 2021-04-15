import * as React from "react";
import { connect } from "react-redux";
import { Company } from "types/Company";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { deleteCompanyById, updateCompany } from "@actions/companies/CompanyActions";
import { Select, SelectValue } from "@components/Select/Select";
import { RequestData } from "@lib/utils";

interface Props {
  company: Nullable<Company>;
  citizenId: string;
  deleteCompanyById: (id: string, citizenId: string) => void;
  updateCompany: (id: string, citizenId: string, data: RequestData) => Promise<boolean>;
}

const EditCompanyTabC: React.FC<Props> = ({
  company,
  citizenId,
  deleteCompanyById,
  updateCompany,
}) => {
  const [name, setName] = React.useState<string>("");
  const [whitelisted, setWhitelisted] = React.useState<Nullable<SelectValue>>(null);
  const [address, setAddress] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company?.id) {
      return alert("An error occurred EDIT_COMPANY_TAB_LINE_40#onSubmit");
    }

    setLoading(true);
    await updateCompany(company?.id, citizenId, {
      name,
      whitelisted: whitelisted?.value,
      address,
    });

    setLoading(false);
  }

  function handleDelete() {
    if (!company?.id) {
      return alert("An error occurred EDIT_COMPANY_TAB_LINE_52#handleDelete");
    }
    deleteCompanyById(company?.id, citizenId);
  }

  return (
    <>
      <form className="mt-2" onSubmit={onSubmit}>
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
            isClearable={false}
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
          <button disabled={loading} className="btn btn-primary" type="submit">
            {loading ? `${lang.global.loading}..` : lang.citizen.company.update_company}
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
  company: state.companies.company,
});

export const EditCompanyTab = connect(mapToProps, { deleteCompanyById, updateCompany })(
  EditCompanyTabC,
);
