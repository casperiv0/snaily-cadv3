import * as React from "react";
import { connect } from "react-redux";
import { useSearch } from "@casper124578/useful/hooks/useSearch";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import lang from "src/language.json";
import { State } from "types/State";
import { AlertMessage } from "../../../components/AlertMessage/AlertMessage";
import { deleteIncident } from "actions/admin/AdminActions";
import { GetServerSideProps } from "next";
import { initializeStore } from "state/useStore";
import { verifyAuth } from "actions/auth/AuthActions";
import { getCadInfo } from "actions/global/GlobalActions";
import { Seo } from "components/Seo";
import { Item, Span } from "components/Item";
import { useClientPerms } from "hooks/useClientPerms";
import { getIncidents } from "actions/officer/OfficerActions";
import { OfficerIncident } from "types/OfficerIncident";
import { Perm } from "types/Perm";

interface Props {
  incidents: OfficerIncident[];
  loading: boolean;
  getCompanies: () => void;
  deleteIncident: (id: string) => void;
}

const CompanyManagementPage: React.FC<Props> = ({ incidents, deleteIncident }) => {
  const { filtered, onChange, search } = useSearch<OfficerIncident>("case_number", incidents);
  useClientPerms("admin");

  const value = React.useCallback((value: Perm) => {
    return value === "1" ? lang.global.yes : lang.global.no;
  }, []);

  return (
    <AdminLayout>
      <Seo title={lang.officers.incidents} />
      <div>
        <input
          type="text"
          value={search}
          onChange={onChange}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />

        {!incidents[0] ? (
          <AlertMessage message={{ msg: lang.officers.no_incidents, type: "warning" }} />
        ) : (
          <ul className="list-group">
            {filtered.map((incident, idx: number) => {
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

                  <div>
                    <button className="btn btn-danger" onClick={() => deleteIncident(incident.id)}>
                      {lang.global.delete}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getIncidents(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  incidents: state.officers.incidents,
});

export default connect(mapToProps, { deleteIncident })(CompanyManagementPage);
