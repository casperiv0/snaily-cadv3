import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import TowCall from "../../interfaces/TowCall";
import socket from "../../lib/socket";
import { connect } from "react-redux";
import { getTowCalls, endTowCall } from "../../lib/actions/tow-calls";
import NotepadModal from "../../components/modals/notepad";
import useDocTitle from "../../hooks/useDocTitle";
import { SOCKET_EVENTS } from "../../lib/types";

interface Props {
  calls: TowCall[];
  aop: string | null;
  getTowCalls: () => void;
  endTowCall: (id: string) => void;
}

const TowDash: React.FC<Props> = (props) => {
  useDocTitle("Tow Dashboard");
  const { calls, getTowCalls, endTowCall } = props;
  const [aop, setAop] = React.useState(props.aop);

  React.useEffect(() => {
    getTowCalls();
  }, [getTowCalls]);

  React.useEffect(() => {
    const aopHandler = (newAop: string) => setAop(newAop);
    const callsHandler = () => getTowCalls();

    socket.on(SOCKET_EVENTS.UPDATE_AOP, aopHandler);
    socket.on(SOCKET_EVENTS.UPDATE_TOW_CALLS, callsHandler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_AOP, aopHandler);
      socket.off(SOCKET_EVENTS.UPDATE_TOW_CALLS, callsHandler);
    };
  }, [getTowCalls]);

  return (
    <Layout fluid classes="mt-5">
      <h3>
        {window.lang.tow.tow_dashboard} - AOP: {aop}
      </h3>

      <ul className="list-group">
        <li className="list-group-item bg-secondary d-flex justify-content-between">
          <h4>{window.lang.tow.active_tow_calls}</h4>

          <button data-bs-toggle="modal" data-bs-target="#notepad" className="btn btn-dark">
            {window.lang.global.notepad}
          </button>
        </li>
        {!calls[0] ? (
          <li className="list-group-item bg-dark border-secondary">{window.lang.tow.no_calls}</li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>{window.lang.global.location}</th>
                <th>{window.lang.global.caller}</th>
                <th>{window.lang.global.description}</th>
                <th>{window.lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: TowCall, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{call.location}</td>
                    <td>{call.name}</td>
                    <td>{call.description}</td>
                    <td>
                      <button onClick={() => endTowCall(call.id)} className="btn btn-success">
                        {window.lang.tow.end_call}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ul>

      <NotepadModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.tow_calls,
  aop: state.global.aop,
});

export default connect(mapToProps, { getTowCalls, endTowCall })(TowDash);
