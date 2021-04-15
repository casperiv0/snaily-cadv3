import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Layout } from "@components/Layout";
import lang from "src/language.json";
import { ModalIds } from "types/ModalIds";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { getCompanies } from "@actions/companies/CompanyActions";
import { GetServerSideProps } from "next";
import { Seo } from "@components/Seo";
import { getUserCitizens, getUserCompanies } from "@actions/citizen/CitizenActions";
import { JoinCompanyModal } from "@components/company/JoinCompanyModal";
import { CreateCompanyModal } from "@components/company/CreateCompanyModal";
import { State } from "types/State";
import { Company } from "types/Company";
import { Item, Span } from "@components/Item";

interface Props {
  message: string;
  companies: Company[];
}

const ManageCompaniesPage: React.FC<Props> = ({ message, companies }) => {
  return (
    <Layout>
      <Seo title="Manage companies" />
      {message ? <AlertMessage message={{ msg: message, type: "success" }} dismissible /> : null}

      <button
        type="button"
        className="btn btn-dark p-2 container mb-2"
        data-bs-toggle="modal"
        data-bs-target={`#${ModalIds.JoinCompany}`}
      >
        {lang.citizen.company.join}
      </button>
      <button
        type="button"
        className="btn btn-dark p-2 container"
        data-bs-toggle="modal"
        data-bs-target={`#${ModalIds.CreateCompany}`}
      >
        {lang.citizen.company.create}
      </button>

      <div className="mt-3">
        <h3>Your citizens companies</h3>
        <ul className="list-group mt-1">
          {companies.map((company) => {
            return (
              <li
                key={company.id}
                className="list-group-item d-flex justify-content-between bg-dark border-secondary text-light"
              >
                <div>
                  <Item>
                    <Span>Company: </Span> {company.name}
                  </Item>
                  <Item>
                    <Span>Citizen:</Span> {(company as any).citizen?.full_name}
                  </Item>
                </div>

                <div className="d-flex flex-column">
                  <Link href={`/company/${company.id}/${company.citizen_id}`}>
                    <a className="btn btn-primary">View company</a>
                  </Link>
                  {company.citizen_id === (company as any).citizen?.id &&
                  ["owner", "manager"].includes((company as any).citizen?.rank) ? (
                    <Link href={`/company/${company.id}/${company.citizen_id}/manage`}>
                      <a className="btn btn-primary mt-1">Manage company</a>
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <JoinCompanyModal />
      <CreateCompanyModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  companies: state.citizen.companies,
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getCompanies(req.headers)(store.dispatch);
  await getUserCitizens(req.headers)(store.dispatch);
  await getUserCompanies(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect(mapToProps)(ManageCompaniesPage);
