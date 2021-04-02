import * as React from "react";
import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import lang from "../../language.json";
import Update911Call from "../modals/dispatch/Update911Call";
import { getActive911Calls } from "../../lib/actions/911-calls";
import { connect } from "react-redux";
import socket from "../../lib/socket";
import { playSound } from "../../lib/functions";
import { ModalIds, SOCKET_EVENTS } from "../../lib/types";

interface Props {
  calls: Call[];
  getActive911Calls: () => void;
}

const ActiveCalls: React.FC<Props> = ({ calls, getActive911Calls }) => {
  const [tempCall, setTempCall] = React.useState<Call | null>(null);

  React.useEffect(() => {
    getActive911Calls();
  }, [getActive911Calls]);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const callHandler = () => getActive911Calls();
    const newCallHandler = () => sound.play();

    socket.on(SOCKET_EVENTS.UPDATE_911_CALLS, callHandler);
    socket.on(SOCKET_EVENTS.NEW_911_CALL, newCallHandler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_911_CALLS, callHandler);
      socket.off(SOCKET_EVENTS.NEW_911_CALL, newCallHandler);
      sound.stop();
    };
  }, [getActive911Calls]);

  return (
    <>
      <ul className="list-group overflow-auto mt-2" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary">
          <h5>{lang.global.active_erm_calls}</h5>
        </li>

        {!calls[0] ? (
          <li className="list-group-item bg-dark border-dark">{lang.global.no_calls}</li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{lang.dispatch.caller_name}</th>
                <th scope="col">{lang.dispatch.caller_location}</th>
                <th scope="col">{lang.dispatch.call_desc}</th>
                <th scope="col">{lang.dispatch.status}</th>
                <th scope="col">{window.lang.citizen.medical.type2}</th>
                <th scope="col">{lang.dispatch.assigned_unit}</th>
                <th scope="col">{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: Call, idx: number) => {
                return (
                  <tr id={`${idx}`} key={call.id}>
                    <th scope="row">{++idx}</th>
                    <td>{call.name}</td>
                    <td>{call.location}</td>
                    <td>{call.description}</td>
                    <td>{call.status}</td>
                    <td>{call.type === "1" ? window.lang.dispatch.citizen_call : call.type}</td>
                    <td>
                      {call.assigned_unit.map((c, i) => {
                        const comma = i !== call.assigned_unit.length - 1 ? ", " : " ";
                        return (
                          <span key={c.value}>
                            {c.label}
                            {comma}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target={`#${ModalIds.Update911Call}`}
                        onClick={() => setTempCall(call)}
                      >
                        {lang.dispatch.update_call}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ul>

      <Update911Call call={tempCall as Call} />
    </>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls_911,
});

const Memoized = React.memo(ActiveCalls);

export default connect(mapToProps, { getActive911Calls })(Memoized);
