import { connect } from "react-redux";
import * as React from "react";
import { verifyAuth } from "@actions/auth/AuthActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { Layout } from "src/components/Layout";
import { Nullable, State } from "types/State";
import { Seo } from "@components/Seo";
import { ModalIds } from "types/ModalIds";
import { getCadInfo } from "@actions/global/GlobalActions";
import { SocketEvents } from "types/Socket";
import { useSocket } from "@hooks/useSocket";
import lang from "../language.json";
import { TruckLog } from "types/TruckLog";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { CreateTruckLogModal } from "@components/modals/truck-logs/CreateTruckLogModal";
import { getTruckLogs, deleteTruckLog } from "@actions/truck-logs/TruckLogActions";

interface Props {
  aop: Nullable<string>;
  logs: TruckLog[];
  deleteTruckLog: (id: string) => void;
}

const TruckLogsPage = ({ logs, deleteTruckLog, ...rest }: Props) => {
  const [aop, setAop] = React.useState(rest.aop);
  const socket = useSocket();

  React.useEffect(() => {
    const handler = (newAop: string) => setAop(newAop);
    socket?.on(SocketEvents.UpdateAop, handler);

    return () => {
      socket?.off(SocketEvents.UpdateAop, handler);
    };
  }, [socket]);

  return (
    <Layout>
      <Seo title={lang.nav.trucklogs} />

      <div className="d-flex justify-content-between mb-3">
        <h3>
          {lang.nav.trucklogs} - AOP: {aop}
        </h3>
        <button
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateTruckLog}`}
          className="btn btn-secondary"
        >
          {lang.truck_logs.create_truck_log}
        </button>
      </div>

      {!logs[0] ? (
        <AlertMessage message={{ msg: lang.truck_logs.no_logs, type: "warning" }} />
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{lang.global.name}</th>
              <th scope="col">{lang.truck_logs.co_driver}</th>
              <th scope="col">{lang.truck_logs?.date}</th>
              <th scope="col">{lang.truck_logs.start_time}</th>
              <th scope="col">{lang.truck_logs.vehicle_plate}</th>
              <th scope="col">{lang.global.actions}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: TruckLog, idx: number) => {
              return (
                <tr id={`${idx}`} key={idx}>
                  <th scope="row">{++idx}</th>
                  <td>{log.name}</td>
                  <td>{log.co_driver}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.start_time}</td>
                  <td>{log.plate}</td>
                  <td>
                    <button
                      onClick={() => {
                        deleteTruckLog(log.id);
                      }}
                      className="btn btn-danger"
                    >
                      {lang.global.delete}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <CreateTruckLogModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getTruckLogs(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  logs: state.truckLogs.logs,
  aop: state.global.aop,
});

export default connect(mapToProps, { deleteTruckLog })(TruckLogsPage);
