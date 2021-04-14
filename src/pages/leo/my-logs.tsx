import * as React from "react";
import formatDistance from "date-fns/formatDistance";
import { connect } from "react-redux";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "@components/Layout";
import { Officer, OfficerLog } from "types/Officer";
import { State } from "types/State";
import { getMyOfficers, getMyOfficerLogs } from "@actions/officer/OfficerActions";
import lang from "../../language.json";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { Item, Span } from "@components/Item";
import { Seo } from "@components/Seo";

interface Props {
  officers: Officer[];
  logs: OfficerLog[];
}

const OfficerLogsPage: React.FC<Props> = ({ officers, logs }) => {
  return (
    <Layout classes="mt-5">
      <Seo title="My officer logs" />

      <h3>{lang.officers.logs}</h3>
      <Link href="/leo/dash">
        <a className="btn btn-primary text-light w-100 p-2 my-2">{lang.global.back_to_dashboard}</a>
      </Link>

      <ul className="list-group mt-2">
        {!logs[0] ? (
          <p>{lang.officers.no_logs}</p>
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
                  <Span>{lang.officers.started_at}: </Span>
                  {new Date(+log.started_at).toLocaleString()}
                </Item>
                <Item id="ended_at">
                  <Span>{lang.officers.ended_at}: </Span>
                  {log.ended_at !== "0"
                    ? new Date(+log.ended_at).toLocaleString()
                    : lang.officers.not_ended_yet}
                </Item>

                <Item id="total">
                  <Span>{lang.officers.total_time}: </Span>
                  {log.ended_at !== "0"
                    ? `${formatDistance(+log.ended_at, +log.started_at)}`
                    : lang.officers.not_ended_yet}
                </Item>
              </li>
            );
          })
        )}
      </ul>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getMyOfficers(req.headers)(store.dispatch);
  await getMyOfficerLogs(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
  logs: state.officers.logs,
});

export default connect(mapToProps)(OfficerLogsPage);
