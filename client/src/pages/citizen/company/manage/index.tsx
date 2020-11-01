import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import AlertMessage from "../../../../components/alert-message";
import EditCompanyTab from "../../../../components/company/EditCompanyTab";
import EmployeesTab from "../../../../components/company/EmployeesTab";
import VehiclesTab from "../../../../components/company/VehiclesTab";
import Layout from "../../../../components/Layout";
import Citizen from "../../../../interfaces/Citizen";
import Match from "../../../../interfaces/Match";
import State from "../../../../interfaces/State";
import lang from "../../../../language.json";
import { getCitizenById } from "../../../../lib/actions/citizen";
import { getCompanyById } from "../../../../lib/actions/company";

interface Props {
  match: Match;
  message: string;
  citizen: Citizen;
  getCompanyById: (id: string) => void;
  getCitizenById: (id: string) => void;
}

const ManageCompanyPage: React.FC<Props> = ({
  match,
  message,
  citizen,
  getCompanyById,
  getCitizenById,
}) => {
  const { companyId, citizenId } = match.params;
  const history = useHistory();

  React.useEffect(() => {
    getCompanyById(companyId);
    getCitizenById(citizenId);
  }, [companyId, getCompanyById, getCitizenById, citizenId]);

  React.useEffect(() => {
    if (citizen !== null && citizen?.id) {
      if (!["owner", "manager"].includes(String(citizen.rank))) {
        history.push("/forbidden");
      }
    }
  }, [citizen, history]);

  return (
    <Layout>
      {message ? <AlertMessage type="success" message={message} dismissible /> : null}

      <h3>{lang.citizen.company.manage_company}</h3>
      <ul className="nav nav-tabs mt-3" id="manage_tabs" role="tablist">
        <li className="nav-item mr-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="home-tab"
            data-toggle="tab"
            href="#company_employees"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            {lang.citizen.company.employees}
          </a>
        </li>
        <li className="nav-item mr-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="profile-tab"
            data-toggle="tab"
            href="#company_vehicles"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            {lang.admin.values.vehicles.index}
          </a>
        </li>
        <li className="nav-item mr-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="contact-tab"
            data-toggle="tab"
            href="#pending_citizens"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
          >
            {lang.citizen.company.pending}
          </a>
        </li>
        {citizen?.rank === "owner" ? (
          <li className="nav-item mr-1" role="presentation">
            <a
              className="nav-link bg-dark border-dark text-light"
              id="contact-tab"
              data-toggle="tab"
              href="#edit_company"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
            >
              {lang.citizen.company.edit_company}
            </a>
          </li>
        ) : null}
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="company_employees"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <EmployeesTab match={match} />
        </div>
        <div
          className="tab-pane fade"
          id="company_vehicles"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <VehiclesTab />
        </div>
        {/*<div
          className="tab-pane fade"
          id="pending_citizens"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <CompanyPending companyURL={companyURL} />
        </div>*/}
        {citizen?.rank === "owner" ? (
          <div
            className="tab-pane fade"
            id="edit_company"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <EditCompanyTab match={match} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  company: state.company.company,
  message: state.global.message,
  citizen: state.citizen.citizen,
});

export default connect(mapToProps, { getCompanyById, getCitizenById })(ManageCompanyPage);
