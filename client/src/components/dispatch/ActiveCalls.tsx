import * as React from "react";
import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import lang from "../../language.json";
import Update911Call from "../modals/dispatch/Update911Call";
import { getActive911Calls } from "../../lib/actions/911-calls";
import { connect } from "react-redux";
import socket from "../../lib/socket";
import { playSound } from "../../lib/functions";

interface Props {
  calls: Call[];
  getActive911Calls: () => void;
}

const ActiveCalls: React.FC<Props> = ({ calls, getActive911Calls }) => {
  React.useEffect(() => {
    getActive911Calls();
  }, [getActive911Calls]);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const callHandler = () => getActive911Calls();
    const newCallHandler = () => sound.play();

    socket.on("UPDATE_911_CALLS", callHandler);
    socket.on("NEW_911_CALL", newCallHandler);

    return () => {
      socket.off("UPDATE_911_CALLS", callHandler);
      socket.off("NEW_911_CALL", newCallHandler);
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
                        data-bs-target={`#update911Call${call.id}`}
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
      {calls.map((call: Call) => {
        return <Update911Call key={call.id} id={call.id} call={call} />;
      })}
    </>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls_911,
});

const Memoized = React.memo(ActiveCalls);

export default connect(mapToProps, { getActive911Calls })(Memoized);
