import * as React from "react";
import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { getActive911Calls } from "../../lib/actions/911-calls";
import socket from "../../lib/socket";
import { playSound } from "../../lib/functions";

interface Props {
  calls: Call[];
  getActive911Calls: () => void;
}

const Active911Calls: React.FC<Props> = ({ calls, getActive911Calls }) => {
  React.useEffect(() => {
    getActive911Calls();
  }, [getActive911Calls]);

  React.useEffect(() => {
    socket.on("UPDATE_911_CALLS", () => {
      getActive911Calls();
    });
    socket.on("NEW_911_CALL", () => {
      playSound("/sounds/new-call.mp3");
    });
  }, [getActive911Calls]);

  return (
    <ul className="list-group overflow-auto" style={{ maxHeight: "25rem" }}>
      <li className="bg-secondary border-secondary list-group-item sticky-top">
        {lang.global.active_erm_calls}
      </li>
      {!calls[0] ? (
        <li className="list-group-item bg-dark">{lang.global.no_calls}</li>
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
            </tr>
          </thead>
          <tbody>
            {calls.map((call: Call, idx: number) => {
              return (
                <tr id={`${idx}`} key={idx}>
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
                          {c.value}
                          {comma}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls_911,
});

const Memoized = React.memo(Active911Calls);

export default connect(mapToProps, { getActive911Calls })(Memoized);
