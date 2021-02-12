import * as React from "react";
import { connect } from "react-redux";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import JoinCompanyModal from "../../../components/modals/company/joinCompanyModal";
import CreateCompanyModal from "../../../components/modals/company/createCompanyModal";
import lang from "../../../language.json";
import { getCompanyData } from "../../../lib/actions/company";

interface Props {
  message: string;
  getCompanyData: () => void;
}

const ManageCompaniesPage: React.FC<Props> = ({ message, getCompanyData }) => {
  React.useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  return (
    <Layout>
      {message ? <AlertMessage message={{ msg: message, type: "success" }} dismissible /> : null}

      <button
        type="button"
        className="btn btn-dark p-2 container mb-2"
        data-bs-toggle="modal"
        data-bs-target="#joinCompanyModal"
      >
        {lang.citizen.company.join}
      </button>
      <button
        type="button"
        className="btn btn-dark p-2 container"
        data-bs-toggle="modal"
        data-bs-target="#createCompanyModal"
      >
        {lang.citizen.company.create}
      </button>

      <JoinCompanyModal />
      <CreateCompanyModal />
    </Layout>
  );
};

export default connect(null, { getCompanyData })(ManageCompaniesPage);
