import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "@components/Layout";
import { State } from "types/State";
import lang from "src/language.json";
import { getIncidents, getMyOfficers } from "@actions/officer/OfficerActions";
import { ModalIds } from "types/ModalIds";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { OfficerIncident } from "types/OfficerIncident";
import { CreateIncidentModal } from "@components/modals/leo/CreateIncidentModal";

interface Props {
  incidents: OfficerIncident[];
}

const MyOfficersPage: React.FC<Props> = ({ incidents }) => {
  return (
    <Layout classes="mt-5">
      <Seo title={lang.officers.incidents} />

      <h3>{lang.officers.incidents}</h3>

      <div className="d-flex justify-content-between mb-2">
        <Link href="/leo/dash">
          <a className="btn btn-primary text-light w-100">{lang.global.back_to_dashboard}</a>
        </Link>
        <button
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateIncident}`}
          className="btn btn-dark text-light w-100 p-2 mx-2"
        >
          {lang.officers.create_incident}
        </button>
      </div>

      <ul className="list-group mt-2">
        {!incidents[0] ? (
          <p>{lang.officers.no_incidents}</p>
        ) : (
          incidents.map((incident, idx: number) => {
            return (
              <li
                key={idx}
                id={`${incident.case_number}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <p>
                  <a href={`#${incident.case_number}`}>#{incident.case_number}</a>
                </p>
                <div></div>
              </li>
            );
          })
        )}
      </ul>

      <CreateIncidentModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  // TODO:
  await getAllOfficers(req.headers)(store.dispatch);
  await getIncidents(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
  incidents: state.officers.incidents,
});

export default connect(mapToProps, {})(MyOfficersPage);
