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
import { Item, Span } from "@components/Item";
import { Citizen } from "types/Citizen";
import { Company } from "types/Company";
import { useOpenModal } from "@hooks/useOpenModal";

interface Props {
  message: string;
  companies: (Citizen & {
    company: Company;
  })[];
}

const ManageCompaniesPage: React.FC<Props> = ({ message, companies }) => {
  useOpenModal();

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
          {companies.map((citizen) => {
            return (
              <li
                key={citizen.id}
                className="list-group-item d-flex justify-content-between bg-dark border-secondary text-light"
              >
                <div>
                  <Item>
                    <Span>{lang.citizen.company.name}: </Span> {citizen.company.name}
                  </Item>
                  <Item>
                    <Span>{lang.citizen.citizen}:</Span> {citizen.full_name}
                  </Item>
                  <Item>
                    <Span>{lang.global.rank}:</Span> {citizen.rank}
                  </Item>
                </div>

                <div className="d-flex flex-column">
                  <Link href={`/company/${citizen.company.id}/${citizen.id}`}>
                    <a className="btn btn-primary">View company</a>
                  </Link>
                  {citizen.company.citizen_id === citizen?.id &&
                  ["owner", "manager"].includes(citizen.rank) ? (
                    <Link href={`/company/${citizen.company.id}/${citizen.id}/manage`}>
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
