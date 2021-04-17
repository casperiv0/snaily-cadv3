import * as React from "react";
import { AdminLayout } from "@components/admin/AdminLayout";
import { Citizen } from "types/Citizen";
import lang from "src/language.json";
import { State } from "types/State";
import { connect } from "react-redux";
import { getCitizens, getAllExpungementRequests } from "@actions/admin/AdminActions";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { AllCitizensTab } from "@components/admin/AllCitizens";
import { ExpungementRequest } from "types/ExpungementRequest";
import { ExpungementRequestsTab } from "@components/admin/ExpungementRequestsTab";
import { useClientPerms } from "@hooks/useClientPerms";
import { useSearch } from "@hooks/useSearch";

interface Props {
  requests: ExpungementRequest[];
  citizens: Citizen[];
}

const ManageCitizensPage: React.FC<Props> = ({ citizens, requests }) => {
  const { search, filtered, onChange } = useSearch<Citizen>("full_name", citizens);
  useClientPerms("admin");

  return (
    <AdminLayout>
      <Seo title="Citizen management" />
      <div className="list-group">
        <input
          className="form-control bg-dark border-secondary text-light mb-2"
          type="search"
          value={search}
          onChange={onChange}
          placeholder={`${lang.global.search}..`}
        />

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              id="all-citizens-tab"
              className="nav-link active bg-dark text-light border-dark"
              data-bs-toggle="tab"
              href="#citizens_tab"
              role="tab"
              aria-controls="citizens_tab"
              aria-selected="true"
            >
              {lang.admin.all_citizens}
            </a>
          </li>
          <li className="nav-item">
            <a
              id="expungement-requests-tab"
              className="nav-link bg-dark text-light border-dark mx-1"
              data-bs-toggle="tab"
              href="#expungement-requests"
              role="tab"
              aria-controls="expungement-requests"
              aria-selected="false"
            >
              {lang.court.requests}
              <span className="badge bg-primary ms-2">{requests.length}</span>
            </a>
          </li>
        </ul>

        <div className="tab-content mt-1" id="citizen-tabs">
          <>
            <div
              className="tab-pane fade show active"
              id="citizens_tab"
              role="tabpanel"
              aria-labelledby="all-citizens-tab"
            >
              <AllCitizensTab citizens={filtered} />
            </div>
            <div
              className="tab-pane fade"
              id="expungement-requests"
              role="tabpanel"
              aria-labelledby="expungement-requests-tab"
            >
              <ExpungementRequestsTab requests={requests} />
            </div>
          </>
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getCitizens(req.headers)(store.dispatch);
  await getAllExpungementRequests(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  citizens: state.admin.citizens,
  requests: state.admin.expungementRequests,
});

export default connect(mapToProps)(ManageCitizensPage);
