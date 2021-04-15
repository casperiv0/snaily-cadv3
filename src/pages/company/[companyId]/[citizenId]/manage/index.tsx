import * as React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { initializeStore } from "@state/useStore";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { EditCompanyTab } from "@components/company/tabs/EditCompanyTab";
import { EmployeesTab } from "@components/company/tabs/EmployeesTab";
import { PendingTab } from "@components/company/tabs/PendingTab";
import { VehiclesTab } from "@components/company/tabs/VehiclesTab";
import { Layout } from "@components/Layout";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { getCitizenById } from "@actions/citizen/CitizenActions";
import { getCompanyById } from "@actions/companies/CompanyActions";
import { Seo } from "@components/Seo";
import { Company } from "types/Company";

interface Props {
  citizen: Nullable<Citizen>;
  error: Nullable<string>;
  company: Nullable<Company>;
}

const ManageCompanyPage: React.FC<Props> = ({ company, citizen, error }) => {
  const router = useRouter();
  const citizenId = `${citizen?.id}`;
  const companyId = `${company?.id}`;

  React.useEffect(() => {
    if (citizen?.id && !["owner", "manager"].includes(String(citizen.rank))) {
      router.push("/forbidden");
    }
  }, [citizen, router]);

  if (error !== null) {
    return (
      <Layout>
        <AlertMessage message={{ msg: error, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title="Manage company" />

      <h3>{lang.citizen.company.manage_company}</h3>
      <ul className="nav nav-tabs mt-3" id="manage_tabs" role="tablist">
        <li className="nav-item me-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="home-tab"
            data-bs-toggle="tab"
            href="#company_employees"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            {lang.citizen.company.employees}
          </a>
        </li>
        <li className="nav-item me-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="profile-tab"
            data-bs-toggle="tab"
            href="#company_vehicles"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            {lang.admin.values.vehicles.index}
          </a>
        </li>
        <li className="nav-item me-1" role="presentation">
          <a
            className="nav-link bg-dark border-dark text-light"
            id="contact-tab"
            data-bs-toggle="tab"
            href="#pending_citizens"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
          >
            {lang.citizen.company.pending}
          </a>
        </li>
        {citizen?.rank === "owner" ? (
          <li className="nav-item me-1" role="presentation">
            <a
              className="nav-link bg-dark border-dark text-light"
              id="contact-tab"
              data-bs-toggle="tab"
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
          <EmployeesTab companyId={companyId} citizenId={citizenId} />
        </div>
        <div
          className="tab-pane fade"
          id="company_vehicles"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <VehiclesTab />
        </div>
        <div
          className="tab-pane fade"
          id="pending_citizens"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <PendingTab citizenId={citizenId} companyId={companyId} />
        </div>
        {citizen?.rank === "owner" ? (
          <div
            className="tab-pane fade"
            id="edit_company"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <EditCompanyTab citizenId={citizenId} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCompanyById(`${query.companyId}`, `${query.citizenId}`, req.headers)(store.dispatch);
  await getCitizenById(`${query.citizenId}`, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  company: state.companies.company ?? null,
  citizen: state.citizen.citizen ?? null,
  error: state.companies.error,
});

export default connect(mapToProps)(ManageCompanyPage);
