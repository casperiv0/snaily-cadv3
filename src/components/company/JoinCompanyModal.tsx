import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "src/language.json";
import { Citizen } from "types/Citizen";
import { Company } from "types/Company";
import { State } from "types/State";
import { joinCompany } from "@actions/companies/CompanyActions";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import { useRouter } from "next/router";
import { RequestData } from "@lib/utils";

interface Props {
  citizens: Citizen[];
  companies: Company[];
  joinCompany: (data: RequestData) => Promise<boolean | string>;
}

const JoinCompanyModalC: React.FC<Props> = ({ citizens, companies, joinCompany }) => {
  const [citizenId, setCitizenId] = React.useState<SelectValue | null>(null);
  const [companyId, setCompanyId] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await joinCompany({
      citizen_id: citizenId?.value,
      company_id: companyId?.value,
    });

    if (typeof success === "string") {
      router.push(success);
    }

    setLoading(false);
  }

  return (
    <Modal title={lang.citizen.company.join} id={ModalIds.JoinCompany}>
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
            disabled={!citizenId?.value || !companyId?.value || loading}
            type="submit"
            className="btn btn-primary"
          >
            {loading ? `${lang.global.loading}..` : lang.citizen.company.join}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
  companies: state.companies.companies,
});

export const JoinCompanyModal = connect(mapToProps, { joinCompany })(JoinCompanyModalC);
