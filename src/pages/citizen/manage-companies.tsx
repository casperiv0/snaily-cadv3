import * as React from "react";
import { connect } from "react-redux";
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
import { getUserCitizens } from "@actions/citizen/CitizenActions";
import { JoinCompanyModal } from "@components/company/JoinCompanyModal";
import { CreateCompanyModal } from "@components/company/CreateCompanyModal";

interface Props {
  message: string;
}

const ManageCompaniesPage: React.FC<Props> = ({ message }) => {
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

      <JoinCompanyModal />
      <CreateCompanyModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getCompanies(req.headers)(store.dispatch);
  await getUserCitizens(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect(null)(ManageCompaniesPage);
