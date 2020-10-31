import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import TruckLog from "../../interfaces/TruckLog";
import AlertMessage from "../../components/alert-message";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { getTruckLogs, deleteTruckLog } from "../../lib/actions/truck-logs";
import { connect } from "react-redux";

interface Props {
  message: string;
  aop: string;
  logs: TruckLog[];
  getTruckLogs: () => void;
  deleteTruckLog: (id: string) => void;
}

const TruckLogsDash: React.FC<Props> = (props) => {
  const [aop, setAop] = React.useState<string>(props.aop);
  const { logs, message, getTruckLogs, deleteTruckLog } = props;

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });
  }, []);

  React.useEffect(() => {
    getTruckLogs();
  }, [getTruckLogs]);

  return (
    <Layout fluid classes="mt-5">
      {message ? <AlertMessage type="success" message={message} dismissible /> : null}
      <div className="d-flex justify-content-between mb-3">
        <h3>
          {lang.nav.trucklogs} - AOP: {aop}
        </h3>
        <a className="btn btn-secondary" href="/truck-logs/create">
          {lang.truck_logs.create_truck_log}
        </a>
      </div>

      {!logs[0] ? (
        <AlertMessage type="warning" message="You don't have any truck logs" />
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
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  logs: state.truck_logs.logs,
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps, { getTruckLogs, deleteTruckLog })(TruckLogsDash);
