import * as React from "react";
import { Link } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import Layout from "../../components/Layout";
import Officer, { OfficerLog } from "../../interfaces/Officer";
import State from "../../interfaces/State";
import { connect } from "react-redux";
import { getMyOfficers, getMyOfficerLogs } from "../../lib/actions/officer";
import { Item, Span } from "../citizen/citizen-info";
import lang from "../../language.json";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  officers: Officer[];
  logs: OfficerLog[];
  getMyOfficers: () => void;
  getMyOfficerLogs: () => void;
}

const OfficerLogsPage: React.FC<Props> = ({ officers, logs, getMyOfficers, getMyOfficerLogs }) => {
  useDocTitle("My officer logs");
  React.useEffect(() => {
    getMyOfficers();
    getMyOfficerLogs();
  }, [getMyOfficers, getMyOfficerLogs]);

  return (
    <Layout classes="mt-5">
      <h3>{window.lang.officers.logs}</h3>
      <Link className="btn btn-primary text-light w-100 p-2 my-2" to="/leo/dash">
        {lang.global.back_to_dashboard}
      </Link>

      <ul className="list-group mt-2">
        {!logs[0] ? (
          <p>{window.lang.officers.no_logs}</p>
        ) : (
          logs.map((log, idx) => {
            const officer = officers.find((off) => off.id === log.officer_id);

            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary text-white"
              >
                <Item id="officer_name">
                  <Span>{lang.dispatch.officer_name}: </Span>
                  {officer?.officer_name}
                </Item>
                <Item id="started_at">
                  <Span>{window.lang.officers.started_at}: </Span>
                  {new Date(+log.started_at).toLocaleString()}
                </Item>
                <Item id="ended_at">
                  <Span>{window.lang.officers.ended_at}: </Span>
                  {log.ended_at !== "0"
                    ? new Date(+log.ended_at).toLocaleString()
                    : window.lang.officers.not_ended_yet}
                </Item>

                <Item id="total">
                  <Span>{window.lang.officers.total_time}: </Span>
                  {log.ended_at !== "0"
                    ? `${formatDistance(+log.ended_at, +log.started_at)}`
                    : window.lang.officers.not_ended_yet}
                </Item>
              </li>
            );
          })
        )}
      </ul>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
  logs: state.officers.logs,
});

export default connect(mapToProps, { getMyOfficers, getMyOfficerLogs })(OfficerLogsPage);
