import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "@components/Layout";
import { State } from "types/State";
import lang from "src/language.json";
import { getAllOfficers, getIncidents } from "@actions/officer/OfficerActions";
import { ModalIds } from "types/ModalIds";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { OfficerIncident } from "types/OfficerIncident";
import { CreateIncidentModal } from "@components/modals/leo/CreateIncidentModal";
import { Item, Span } from "@components/Item";
import { Perm } from "types/Perm";
import { useSearch } from "@hooks/useSearch";

interface Props {
  incidents: OfficerIncident[];
}

const MyOfficersPage: React.FC<Props> = ({ incidents }) => {
  const { search, onChange, filtered } = useSearch<OfficerIncident>("case_number", incidents);

  const value = React.useCallback((value: Perm) => {
    return value === "1" ? lang.global.yes : lang.global.no;
  }, []);

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
          className="btn btn-dark text-light w-100 ms-2"
        >
          {lang.officers.create_incident}
        </button>
      </div>

      <input
        className="form-control bg-dark border-dark text-light"
        onChange={onChange}
        value={search}
        placeholder={`${lang.global.search}..`}
      />

      <ul className="list-group mt-2">
        {!incidents[0] ? (
          <p>{lang.officers.no_incidents}</p>
        ) : (
          filtered.map((incident, idx: number) => {
            return (
              <li
                key={idx}
                id={`${incident.case_number}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <div>
                  <a href={`#${incident.case_number}`}>Case: #{incident.case_number}</a>

                  <Item>
                    <Span>{lang.global.description}: </Span>
                    {incident.narrative}
                  </Item>
                  <Item>
                    <Span>Officer: </Span>
                    {incident.officer_dept} - {incident.officer_name}
                  </Item>
                  <Item>
                    <Span>{lang.officers.involved_officers}: </Span>
                    {typeof incident.involved_officers !== "string" &&
                      incident.involved_officers.map((v) => v).join(", ")}
                  </Item>
                  <Item>
                    <Span>{lang.officers.firearms_involved}: </Span>
                    {value(incident.firearms_involved)}
                  </Item>
                  <Item>
                    <Span>{lang.officers.injuries_fatalities}: </Span>
                    {value(incident.injuries)}
                  </Item>
                  <Item>
                    <Span>{lang.officers.arrests_made}: </Span>
                    {value(incident.arrests_made)}
                  </Item>
                  <Item>
                    <Span>{lang.truck_logs.date}: </Span>
                    {incident.full_date}
                  </Item>
                </div>

                <div>{}</div>
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
  await getAllOfficers(req.headers)(store.dispatch);
  await getIncidents(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
  incidents: state.officers.incidents,
});

export default connect(mapToProps, {})(MyOfficersPage);
