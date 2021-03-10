import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import TowCall from "../../interfaces/TowCall";
import socket from "../../lib/socket";
import AlertMessage from "../../components/alert-message";
import lang from "../../language.json";
import { connect } from "react-redux";
import { getTowCalls, endTowCall } from "../../lib/actions/tow-calls";
import NotepadModal from "../../components/modals/notepad";
import Message from "../../interfaces/Message";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  message: Message | null;
  calls: TowCall[];
  aop: string | null;
  getTowCalls: () => void;
  endTowCall: (id: string) => void;
}

const TowDash: React.FC<Props> = (props) => {
  useDocTitle("Tow Dashboard");
  const { calls, message, getTowCalls, endTowCall } = props;
  const [aop, setAop] = React.useState(props.aop);

  React.useEffect(() => {
    getTowCalls();
  }, [getTowCalls]);

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });
  }, []);

  React.useEffect(() => {
    socket.on("UPDATE_TOW_CALLS", () => {
      // todo: play a sound
      getTowCalls();
    });
  }, [getTowCalls]);

  return (
    <Layout fluid classes="mt-5">
      {message ? <AlertMessage message={message} dismissible /> : null}

      <h3>
        {lang.tow.tow_dashboard} - AOP: {aop}
      </h3>

      <ul className="list-group">
        <li className="list-group-item bg-secondary d-flex justify-content-between">
          <h4>{lang.tow.active_tow_calls}</h4>

          <button data-bs-toggle="modal" data-bs-target="#notepad" className="btn btn-dark">
            {lang.global.notepad}
          </button>
        </li>
        {!calls[0] ? (
          <li className="list-group-item bg-dark border-secondary">{lang.tow.no_calls}</li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>{lang.global.location}</th>
                <th>{lang.global.description}</th>
                <th>{lang.global.caller}</th>
                <th>{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: TowCall, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{call.name}</td>
                    <td>{call.location}</td>
                    <td>{call.description}</td>
                    <td>
                      <button onClick={() => endTowCall(call.id)} className="btn btn-success">
                        {lang.tow.end_call}
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
  message: state.global.message,
});

export default connect(mapToProps, { getTowCalls, endTowCall })(TowDash);
