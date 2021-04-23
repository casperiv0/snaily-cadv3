import * as React from "react";
import { connect } from "react-redux";
import { Call } from "types/Call";
import { State } from "types/State";
import lang from "../../language.json";
import Update911Call from "../modals/dispatch/Update911Call";
import { getCalls } from "@actions/calls/CallActions";
import { playSound } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { SocketEvents } from "types/Socket";
import { socket } from "@hooks/useSocket";
import { CallTypes } from "@actions/calls/CallTypes";

interface Props {
  calls: Call[];
  getCalls: (type: CallTypes) => void;
}

const ActiveCallsC: React.FC<Props> = ({ calls, getCalls }) => {
  const [tempCall, setTempCall] = React.useState<Call | null>(null);

  React.useEffect(() => {
    getCalls("911");
  }, [getCalls]);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const callHandler = () => getCalls("911");
    const newCallHandler = () => sound.play();

    socket.on(SocketEvents.Update911Calls, callHandler);
    socket.on(SocketEvents.New911Call, newCallHandler);

    return () => {
      socket.off(SocketEvents.Update911Calls, callHandler);
      socket.off(SocketEvents.New911Call, newCallHandler);
      sound.stop();
    };
  }, [getCalls]);

  return (
    <>
      <ul className="list-group overflow-auto mt-2" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary text-white">
          <h5>{lang.global.active_erm_calls}</h5>
        </li>

        {!calls[0] ? (
          <li className="list-group-item bg-dark border-dark text-white">{lang.global.no_calls}</li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{lang.dispatch.caller_name}</th>
                <th scope="col">{lang.dispatch.caller_location}</th>
                <th scope="col">{lang.dispatch.call_desc}</th>
                <th scope="col">{lang.dispatch.status}</th>
                <th scope="col">{lang.citizen.medical.type2}</th>
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
                    <td>{call.type === "1" ? lang.dispatch.citizen_call : call.type}</td>
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

      <Update911Call call={calls.find((c) => c.id === tempCall?.id) ?? null} />
    </>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls,
});

const Memoized = React.memo(ActiveCallsC);

export const ActiveCalls = connect(mapToProps, { getCalls })(Memoized);
